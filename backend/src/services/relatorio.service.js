const { pool: db } = require('../database/connection');

const RESULTADOS_VALIDOS = ['ENCAMINHAR', 'NAO_ENCAMINHAR'];

function validarFiltros(filtros) {
  const erros = [];
  if (filtros.resultado && !RESULTADOS_VALIDOS.includes(filtros.resultado))
    erros.push(`resultado deve ser: ${RESULTADOS_VALIDOS.join(' ou ')}.`);
  if (filtros.dataInicio && isNaN(Date.parse(filtros.dataInicio)))
    erros.push('dataInicio inválida.');
  if (filtros.dataFim && isNaN(Date.parse(filtros.dataFim)))
    erros.push('dataFim inválida.');
  return erros;
}

// GET /relatorios — listagem geral com filtros (compatível com frontend atual)
async function buscarRelatorios(filtros, idUsuarioLogado, tipoUsuario) {
  const erros = validarFiltros(filtros);
  if (erros.length > 0) throw { status: 400, message: 'Filtros inválidos.', details: erros };

  const condicoes = [];
  const valores = [];

  if (filtros.dataInicio) { condicoes.push('a.data_avaliacao >= ?'); valores.push(filtros.dataInicio + ' 00:00:00'); }
  if (filtros.dataFim)    { condicoes.push('a.data_avaliacao <= ?'); valores.push(filtros.dataFim    + ' 23:59:59'); }
  if (filtros.idPaciente) { condicoes.push('a.id_paciente = ?');     valores.push(Number(filtros.idPaciente)); }
  if (filtros.resultado)  { condicoes.push('a.resultado = ?');        valores.push(filtros.resultado); }

  if (tipoUsuario !== 'ADMIN') {
    condicoes.push('a.id_usuario = ?');
    valores.push(idUsuarioLogado);
  } else if (filtros.idUsuario) {
    condicoes.push('a.id_usuario = ?');
    valores.push(Number(filtros.idUsuario));
  }

  const where = condicoes.length > 0 ? 'WHERE ' + condicoes.join(' AND ') : '';

  const [rows] = await db.execute(
    `SELECT
       a.id_avaliacao, a.data_avaliacao, a.score, a.limiar_utilizado, a.resultado,
       a.respondente_nome, a.respondente_parentesco,
       p.id_paciente, p.nome AS paciente_nome, p.sexo AS paciente_sexo,
       u.id_usuario AS profissional_id, u.nome AS profissional_nome
     FROM avaliacoes a
     INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
     INNER JOIN usuarios  u ON u.id_usuario  = a.id_usuario
     ${where}
     ORDER BY a.data_avaliacao DESC`,
    valores
  );

  return rows.map((r) => ({
    id_avaliacao:     r.id_avaliacao,
    data_avaliacao:   r.data_avaliacao,
    score:            r.score,
    limiar_utilizado: r.limiar_utilizado,
    resultado:        r.resultado,
    respondente_nome: r.respondente_nome,
    respondente_parentesco: r.respondente_parentesco,
    paciente_nome:    r.paciente_nome,
    paciente_sexo:    r.paciente_sexo,
    profissional_nome: r.profissional_nome,
    paciente:    { id_paciente: r.id_paciente, nome: r.paciente_nome, sexo: r.paciente_sexo },
    profissional: { id_usuario: r.profissional_id, nome: r.profissional_nome },
  }));
}

// GET /relatorios/paciente/:idPaciente — histórico completo de um paciente
async function relatorioPorPaciente(idPaciente, idUsuarioLogado, tipoUsuario) {
  const condicoes = ['a.id_paciente = ?'];
  const valores = [Number(idPaciente)];

  if (tipoUsuario !== 'ADMIN') {
    condicoes.push('a.id_usuario = ?');
    valores.push(idUsuarioLogado);
  }

  const [[paciente]] = await db.execute(
    `SELECT id_paciente, nome, sexo, idade, cpf, telefone, responsavel FROM pacientes WHERE id_paciente = ? LIMIT 1`,
    [Number(idPaciente)]
  );

  if (!paciente) throw { status: 404, message: 'Paciente não encontrado.' };

  const [avaliacoes] = await db.execute(
    `SELECT
       a.id_avaliacao, a.data_avaliacao, a.score, a.limiar_utilizado, a.resultado,
       a.respondente_nome, a.respondente_parentesco, a.observacoes,
       u.nome AS profissional_nome
     FROM avaliacoes a
     INNER JOIN usuarios u ON u.id_usuario = a.id_usuario
     WHERE ${condicoes.join(' AND ')}
     ORDER BY a.data_avaliacao ASC`,
    valores
  );

  const total = avaliacoes.length;
  const totalEncaminhar = avaliacoes.filter((a) => a.resultado === 'ENCAMINHAR').length;
  const scores = avaliacoes.map((a) => Number(a.score));
  const mediaScore = scores.length > 0 ? Number((scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(3)) : 0;
  const ultimaAvaliacao = avaliacoes.length > 0 ? avaliacoes[avaliacoes.length - 1] : null;

  return {
    paciente,
    resumo: {
      total_avaliacoes: total,
      total_encaminhar: totalEncaminhar,
      total_nao_encaminhar: total - totalEncaminhar,
      media_score: mediaScore,
      ultima_avaliacao: ultimaAvaliacao ? ultimaAvaliacao.data_avaliacao : null,
      ultimo_resultado: ultimaAvaliacao ? ultimaAvaliacao.resultado : null,
    },
    avaliacoes,
  };
}

// GET /relatorios/periodo — todas as avaliações de um período, com resumo e dados para gráfico
async function relatorioPorPeriodo(dataInicio, dataFim, idUsuarioLogado, tipoUsuario) {
  if (!dataInicio || !dataFim) throw { status: 400, message: 'dataInicio e dataFim são obrigatórios.' };
  if (isNaN(Date.parse(dataInicio)) || isNaN(Date.parse(dataFim)))
    throw { status: 400, message: 'Datas inválidas.' };

  const condicoes = ['a.data_avaliacao >= ?', 'a.data_avaliacao <= ?'];
  const valores = [dataInicio + ' 00:00:00', dataFim + ' 23:59:59'];

  if (tipoUsuario !== 'ADMIN') {
    condicoes.push('a.id_usuario = ?');
    valores.push(idUsuarioLogado);
  }

  const where = 'WHERE ' + condicoes.join(' AND ');

  const [avaliacoes] = await db.execute(
    `SELECT
       a.id_avaliacao, a.data_avaliacao, a.score, a.limiar_utilizado, a.resultado,
       p.nome AS paciente_nome, p.sexo AS paciente_sexo,
       u.nome AS profissional_nome
     FROM avaliacoes a
     INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
     INNER JOIN usuarios  u ON u.id_usuario  = a.id_usuario
     ${where}
     ORDER BY a.data_avaliacao ASC`,
    valores
  );

  const porDia = {};
  avaliacoes.forEach((a) => {
    const dia = new Date(a.data_avaliacao).toISOString().split('T')[0];
    if (!porDia[dia]) porDia[dia] = { data: dia, total: 0, encaminhar: 0, nao_encaminhar: 0 };
    porDia[dia].total++;
    if (a.resultado === 'ENCAMINHAR') porDia[dia].encaminhar++;
    else porDia[dia].nao_encaminhar++;
  });

  const total = avaliacoes.length;
  const encaminhar = avaliacoes.filter((a) => a.resultado === 'ENCAMINHAR').length;

  return {
    periodo: { inicio: dataInicio, fim: dataFim },
    resumo: {
      total_avaliacoes: total,
      total_encaminhar: encaminhar,
      total_nao_encaminhar: total - encaminhar,
      taxa_encaminhamento: total > 0 ? Number(((encaminhar / total) * 100).toFixed(1)) : 0,
    },
    grafico_por_dia: Object.values(porDia),
    avaliacoes,
  };
}

// GET /relatorios/resumo — painel geral com gráficos (por mês, por sexo, totais)
async function relatorioResumoGeral(idUsuarioLogado, tipoUsuario) {
  const filtroUsuario = tipoUsuario !== 'ADMIN' ? 'WHERE a.id_usuario = ?' : '';
  const filtroJoin    = tipoUsuario !== 'ADMIN' ? 'AND a.id_usuario = ?'   : '';
  const valores = tipoUsuario !== 'ADMIN' ? [idUsuarioLogado] : [];
  const valoresDuplos = tipoUsuario !== 'ADMIN' ? [idUsuarioLogado, idUsuarioLogado] : [];

  const [[totais]] = await db.execute(
    `SELECT
       COUNT(*) AS total_avaliacoes,
       SUM(resultado = 'ENCAMINHAR') AS total_encaminhar,
       SUM(resultado = 'NAO_ENCAMINHAR') AS total_nao_encaminhar,
       ROUND(AVG(score), 3) AS media_score
     FROM avaliacoes a ${filtroUsuario}`,
    valores
  );

  const [porMes] = await db.execute(
    `SELECT
       DATE_FORMAT(a.data_avaliacao, '%Y-%m') AS mes,
       COUNT(*) AS total,
       SUM(resultado = 'ENCAMINHAR') AS encaminhar,
       SUM(resultado = 'NAO_ENCAMINHAR') AS nao_encaminhar,
       ROUND(AVG(score), 3) AS media_score
     FROM avaliacoes a ${filtroUsuario}
     GROUP BY mes
     ORDER BY mes ASC
     LIMIT 12`,
    valores
  );

  const [porSexo] = await db.execute(
    `SELECT
       p.sexo,
       COUNT(*) AS total,
       SUM(a.resultado = 'ENCAMINHAR') AS encaminhar,
       ROUND(AVG(a.score), 3) AS media_score
     FROM avaliacoes a
     INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
     ${filtroUsuario.replace('WHERE', 'WHERE p.id_paciente IS NOT NULL AND')}
     GROUP BY p.sexo`,
    valores
  );

  const [top5Pacientes] = await db.execute(
    `SELECT
       p.nome AS paciente_nome, p.sexo,
       COUNT(*) AS total_avaliacoes,
       SUM(a.resultado = 'ENCAMINHAR') AS encaminhar
     FROM avaliacoes a
     INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
     ${filtroUsuario.replace('WHERE a.', 'WHERE a.')}
     GROUP BY a.id_paciente, p.nome, p.sexo
     ORDER BY total_avaliacoes DESC
     LIMIT 5`,
    valores
  );

  return {
    totais,
    por_mes: porMes,
    por_sexo: porSexo,
    top5_pacientes: top5Pacientes,
  };
}

module.exports = { buscarRelatorios, relatorioPorPaciente, relatorioPorPeriodo, relatorioResumoGeral };