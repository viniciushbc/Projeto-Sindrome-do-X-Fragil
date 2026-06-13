const { pool: db } = require('../database/connection');

function converterParaJson(valor) {
  if (valor === null || valor === undefined) {
    return null;
  }

  if (typeof valor === 'string') {
    return JSON.stringify({ valor });
  }

  return JSON.stringify(valor);
}

async function registrarAuditoria({
  id_usuario = null,
  entidade,
  id_registro,
  acao,
  dados_anteriores = null,
  dados_novos = null,
  rota_backend = null,
  metodo_http = null,
  ip_origem = null,
  user_agent = null,
}) {
  try {
    const acaoBanco = acao === 'DESATIVACAO' ? 'EDICAO' : acao;

    await db.execute(
      `
      INSERT INTO logs_auditoria (
        id_usuario,
        entidade,
        id_registro,
        acao,
        dados_anteriores,
        dados_novos,
        rota_backend,
        metodo_http,
        ip_origem,
        user_agent,
        data_hora
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        id_usuario,
        entidade,
        id_registro,
        acaoBanco,
        converterParaJson(dados_anteriores),
        converterParaJson(dados_novos),
        rota_backend,
        metodo_http,
        ip_origem,
        user_agent,
      ]
    );
  } catch (err) {
    console.error('[logs.service] Erro ao registrar auditoria:', err.message);
  }
}

/**
 * Função antiga mantida para compatibilidade.
 * Se algum arquivo ainda chamar registrarLog(), não vai quebrar.
 */
async function registrarLog({
  id_usuario,
  entidade,
  id_registro,
  acao,
  campo_alterado = null,
  valor_anterior = null,
  valor_novo = null,
}) {
  return registrarAuditoria({
    id_usuario,
    entidade,
    id_registro,
    acao,
    dados_anteriores: {
      campo_alterado,
      valor_anterior,
    },
    dados_novos: {
      campo_alterado,
      valor_novo,
    },
  });
}

async function listarLogs(filtros = {}) {
  const condicoes = [];
  const valores = [];

  if (filtros.entidade) {
    condicoes.push('l.entidade = ?');
    valores.push(filtros.entidade);
  }

  if (filtros.acao) {
    condicoes.push('l.acao = ?');
    valores.push(filtros.acao);
  }

  if (filtros.idUsuario) {
    condicoes.push('l.id_usuario = ?');
    valores.push(Number(filtros.idUsuario));
  }

  if (filtros.dataInicio) {
    condicoes.push('l.data_hora >= ?');
    valores.push(filtros.dataInicio + ' 00:00:00');
  }

  if (filtros.dataFim) {
    condicoes.push('l.data_hora <= ?');
    valores.push(filtros.dataFim + ' 23:59:59');
  }

  const where = condicoes.length > 0 ? 'WHERE ' + condicoes.join(' AND ') : '';

  const [rows] = await db.execute(
    `
    SELECT
      l.id_log,
      l.id_usuario,
      u.nome AS usuario_nome,
      l.entidade,
      l.id_registro,
      l.acao,
      l.dados_anteriores,
      l.dados_novos,
      l.rota_backend,
      l.metodo_http,
      l.ip_origem,
      l.user_agent,
      l.data_hora
    FROM logs_auditoria l
    LEFT JOIN usuarios u ON u.id_usuario = l.id_usuario
    ${where}
    ORDER BY l.data_hora DESC
    `,
    valores
  );

  return rows.map((r) => ({
    id_log: r.id_log,
    usuario: r.id_usuario
      ? {
          id_usuario: r.id_usuario,
          nome: r.usuario_nome,
        }
      : null,
    entidade: r.entidade,
    id_registro: r.id_registro,
    acao: r.acao,
    dados_anteriores: r.dados_anteriores,
    dados_novos: r.dados_novos,
    rota_backend: r.rota_backend,
    metodo_http: r.metodo_http,
    ip_origem: r.ip_origem,
    user_agent: r.user_agent,
    data_hora: r.data_hora,
  }));
}

module.exports = {
  registrarAuditoria,
  registrarLog,
  listarLogs,
};