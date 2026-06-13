const { pool: db } = require('../database/connection');
const scoreService = require('./score.service');
const pacientesService = require('./pacientes.service');
const logsService = require('./logs.service');

async function criarAvaliacao(dados, idUsuario) {
  const paciente = await pacientesService.buscarPacientePorId(dados.id_paciente);

  if (!paciente) {
    throw { status: 404, message: 'Paciente não encontrado.' };
  }

  if (!paciente.ativo) {
    throw { status: 400, message: 'Paciente está inativo.' };
  }

  const sexo = paciente.sexo;

  if (sexo !== 'M' && sexo !== 'F') {
    throw { status: 400, message: 'Paciente não possui sexo válido para cálculo do score.' };
  }

  const calculo = await scoreService.calcularScore({ sexo, respostas: dados.respostas });

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // NOTA: coluna 'recomendacao' não existe na tabela avaliacoes — não inserir
    const [resultado] = await connection.execute(
      `INSERT INTO avaliacoes (
          id_paciente, id_usuario, data_avaliacao,
          respondente_nome, respondente_parentesco, respondente_documento,
          score, limiar_utilizado, resultado, observacoes
       ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.id_paciente,
        idUsuario,
        dados.respondente_nome || null,
        dados.respondente_parentesco || null,
        dados.respondente_documento || null,
        calculo.score,
        calculo.limiar_utilizado,
        calculo.resultado,
        dados.observacoes || null,
      ]
    );

    const idAvaliacao = resultado.insertId;

    for (const resposta of dados.respostas) {
      await connection.execute(
        `INSERT INTO respostas_avaliacao (id_avaliacao, id_sintoma, presente) VALUES (?, ?, ?)`,
        [idAvaliacao, resposta.id_sintoma, resposta.presente ? 1 : 0]
      );
    }

    await connection.commit();

    await logsService.registrarLog({
      id_usuario: idUsuario,
      entidade: 'AVALIACAO',
      id_registro: idAvaliacao,
      acao: 'CRIACAO',
    });

    return {
      id_avaliacao: idAvaliacao,
      id_paciente: dados.id_paciente,
      score: calculo.score,
      limiar_utilizado: calculo.limiar_utilizado,
      resultado: calculo.resultado,
      recomendacao: calculo.recomendacao, 
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function buscarAvaliacoesPorPaciente(idPaciente, usuarioLogado) {
  const paciente = await pacientesService.buscarPacientePorId(idPaciente);
  if (!paciente) {
    throw { status: 404, message: 'Paciente não encontrado.' };
  }

  const condicoes = ['a.id_paciente = ?'];
  const valores = [Number(idPaciente)];

  if (usuarioLogado.tipo_usuario !== 'ADMIN') {
    condicoes.push('a.id_usuario = ?');
    valores.push(usuarioLogado.id_usuario);
  }

  const [rows] = await db.execute(
    `SELECT
       a.id_avaliacao,
       a.data_avaliacao,
       a.score,
       a.limiar_utilizado,
       a.resultado,
       a.respondente_nome,
       a.respondente_parentesco,
       p.id_paciente,
       p.nome AS paciente_nome,
       p.sexo AS paciente_sexo,
       u.id_usuario AS profissional_id,
       u.nome AS profissional_nome
     FROM avaliacoes a
     INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
     INNER JOIN usuarios u ON u.id_usuario = a.id_usuario
     WHERE ${condicoes.join(' AND ')}
     ORDER BY a.data_avaliacao DESC`,
    valores
  );

  return rows.map((r) => ({
    id_avaliacao: r.id_avaliacao,
    data_avaliacao: r.data_avaliacao,
    score: r.score,
    limiar_utilizado: r.limiar_utilizado,
    resultado: r.resultado,
    paciente: { id_paciente: r.id_paciente, nome: r.paciente_nome, sexo: r.paciente_sexo },
    profissional: { id_usuario: r.profissional_id, nome: r.profissional_nome },
  }));
}

async function buscarAvaliacaoPorId(idAvaliacao, usuarioLogado) {
  const [rows] = await db.execute(
    `SELECT
       a.id_avaliacao,
       a.data_avaliacao,
       a.score,
       a.limiar_utilizado,
       a.resultado,
       a.observacoes,
       a.respondente_nome,
       a.respondente_parentesco,
       a.respondente_documento,
       a.id_usuario AS id_usuario_prof,
       p.id_paciente,
       p.nome AS paciente_nome,
       p.sexo AS paciente_sexo,
       u.nome AS profissional_nome
     FROM avaliacoes a
     INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
     INNER JOIN usuarios u ON u.id_usuario = a.id_usuario
     WHERE a.id_avaliacao = ?
     LIMIT 1`,
    [Number(idAvaliacao)]
  );

  if (rows.length === 0) {
    throw { status: 404, message: 'Avaliação não encontrada.' };
  }

  const avaliacao = rows[0];

  if (usuarioLogado.tipo_usuario !== 'ADMIN' && avaliacao.id_usuario_prof !== usuarioLogado.id_usuario) {
    throw { status: 403, message: 'Acesso negado.' };
  }

  const [respostas] = await db.execute(
    `SELECT ra.id_sintoma, s.nome, ra.presente
     FROM respostas_avaliacao ra
     INNER JOIN sintomas s ON s.id_sintoma = ra.id_sintoma
     WHERE ra.id_avaliacao = ?`,
    [Number(idAvaliacao)]
  );

  return {
    id_avaliacao: avaliacao.id_avaliacao,
    data_avaliacao: avaliacao.data_avaliacao,
    score: avaliacao.score,
    limiar_utilizado: avaliacao.limiar_utilizado,
    resultado: avaliacao.resultado,
    observacoes: avaliacao.observacoes,
    respondente: {
      nome: avaliacao.respondente_nome,
      parentesco: avaliacao.respondente_parentesco,
      documento: avaliacao.respondente_documento,
    },
    paciente: {
      id_paciente: avaliacao.id_paciente,
      nome: avaliacao.paciente_nome,
      sexo: avaliacao.paciente_sexo,
    },
    profissional: {
      id_usuario: avaliacao.id_usuario_prof,
      nome: avaliacao.profissional_nome,
    },
    respostas: respostas.map((r) => ({
      id_sintoma: r.id_sintoma,
      nome: r.nome,
      presente: Boolean(r.presente),
    })),
  };
}

async function listarAvaliacoes(usuarioLogado) {
  const condicoes = [];
  const valores = [];

  if (usuarioLogado && usuarioLogado.tipo_usuario !== 'ADMIN') {
    condicoes.push('a.id_usuario = ?');
    valores.push(usuarioLogado.id_usuario);
  }

  const where = condicoes.length > 0 ? 'WHERE ' + condicoes.join(' AND ') : '';

  const [rows] = await db.execute(
    `SELECT
       a.id_avaliacao,
       a.data_avaliacao,
       a.score,
       a.resultado,
       a.respondente_nome,
       a.respondente_parentesco,
       p.nome AS paciente_nome,
       p.sexo AS paciente_sexo
     FROM avaliacoes a
     INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
     INNER JOIN usuarios u ON u.id_usuario = a.id_usuario
     ${where}
     ORDER BY a.data_avaliacao DESC`,
    valores
  );

  return rows;
}

module.exports = {
  criarAvaliacao,
  buscarAvaliacoesPorPaciente,
  buscarAvaliacaoPorId,
  listarAvaliacoes,
};