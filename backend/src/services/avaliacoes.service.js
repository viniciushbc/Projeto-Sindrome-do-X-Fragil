const {pool:db} = require('../database/connection')
const scoreService = require('./score.service')
const sintomasService = require('./sintomas.service')
const pacientesService = require('./pacientes.service')

function validarSexoPaciente(sexo) {
  return sexo === 'M' || sexo === 'F';
}

function validarSintomasEnviados(respostas, sintomasAplicaveis) {
  const idsAplicaveis = sintomasAplicaveis.map((sintoma) => Number(sintoma.id_sintoma));

  const idsRespostas = respostas.map((resposta) => Number(resposta.id_sintoma));

  const idsInvalidos = idsRespostas.filter((idSintoma) => {
    return !idsAplicaveis.includes(idSintoma);
  });

  if (idsInvalidos.length > 0) {
    throw {
      status: 400,
      message: `Sintoma(s) inválido(s), inativo(s) ou não aplicável(is): ${idsInvalidos.join(', ')}.`
    };
  }

  const idsFaltantes = idsAplicaveis.filter((idSintoma) => {
    return !idsRespostas.includes(idSintoma);
  });

  if (idsFaltantes.length > 0) {
    throw {
      status: 400,
      message: `Resposta(s) obrigatória(s) ausente(s) para o(s) sintoma(s): ${idsFaltantes.join(', ')}.`
    };
  }
}

async function inserirAvaliacao(connection, dados, idUsuario, calculo) {
  const [resultado] = await connection.execute(
    `
      INSERT INTO avaliacoes (
          id_paciente,
          id_usuario,
          data_avaliacao,
          respondente_nome,
          respondente_parentesco,
          respondente_documento,
          score,
          limiar_utilizado,
          resultado,
          observacoes
      )
      VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      dados.id_paciente,
      idUsuario,
      dados.respondente_nome || null,
      dados.respondente_parentesco || null,
      dados.respondente_documento || null,
      calculo.score,
      calculo.limiar_utilizado,
      calculo.resultado,
      dados.observacoes || null
    ]
  );

  return resultado.insertId;
}

async function inserirRespostas(connection, idAvaliacao, respostas) {
  for (const resposta of respostas) {
    await connection.execute(
      `
        INSERT INTO respostas_avaliacao (
            id_avaliacao,
            id_sintoma,
            presente
        )
        VALUES (?, ?, ?)
      `,
      [
        idAvaliacao,
        resposta.id_sintoma,
        resposta.presente ? 1 : 0
      ]
    );
  }
}

async function criarAvaliacao(dados, idUsuario) {
  const paciente = await pacientesService.buscarPacientePorId(dados.id_paciente);

  if (!paciente) {
    throw {
      status: 404,
      message: 'Paciente não encontrado.'
    };
  }

  if (!paciente.ativo) {
    throw {
      status: 400,
      message: 'Paciente está inativo.'
    };
  }

  const sexo = paciente.sexo;

  if (!validarSexoPaciente(sexo)) {
    throw {
      status: 400,
      message: 'Paciente não possui sexo válido para cálculo do score.'
    };
  }

  const sintomasAplicaveis = await sintomasService.listarSintomasAtivosParaCalculo(sexo);

  validarSintomasEnviados(dados.respostas, sintomasAplicaveis);

  const calculo = scoreService.calcularScore(
    sexo,
    sintomasAplicaveis,
    dados.respostas
  );

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const idAvaliacao = await inserirAvaliacao(
      connection,
      dados,
      idUsuario,
      calculo
    );

    await inserirRespostas(
      connection,
      idAvaliacao,
      dados.respostas
    );

    await connection.commit();

    return {
      id_avaliacao: idAvaliacao,
      id_paciente: dados.id_paciente,
      score: calculo.score,
      limiar_utilizado: calculo.limiar_utilizado,
      resultado: calculo.resultado,
      recomendacao: calculo.recomendacao
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


async function listarAvaliacoes() {
  const [rows] = await db.execute(`
    SELECT
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
    ORDER BY a.data_avaliacao DESC
  `);
  return rows;
}

module.exports = {
  criarAvaliacao,
  listarAvaliacoes
};