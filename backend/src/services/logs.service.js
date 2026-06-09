const { pool: db } = require('../database/connection');

async function registrarLog({
  id_usuario,
  entidade,
  id_registro,
  acao,
  campo_alterado = null,
  valor_anterior = null,
  valor_novo = null,
}) {
  try {
    const acaoBanco = acao === 'DESATIVACAO' ? 'EDICAO' : acao;

    await db.execute(
      `INSERT INTO logs_sistema (id_usuario, entidade, id_registro, acao, campo_alterado, valor_anterior, valor_novo, data_hora)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id_usuario,
        entidade,
        id_registro,
        acaoBanco,
        campo_alterado,
        valor_anterior !== null ? String(valor_anterior) : null,
        valor_novo !== null ? String(valor_novo) : null,
      ]
    );
  } catch (err) {
    console.error('[logs.service] Erro ao registrar log:', err.message);
  }
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
    `SELECT
       l.id_log,
       u.id_usuario,
       u.nome AS usuario_nome,
       l.entidade,
       l.id_registro,
       l.acao,
       l.campo_alterado,
       l.valor_anterior,
       l.valor_novo,
       l.data_hora
     FROM logs_sistema l
     INNER JOIN usuarios u ON u.id_usuario = l.id_usuario
     ${where}
     ORDER BY l.data_hora DESC`,
    valores
  );

  return rows.map((r) => ({
    id_log: r.id_log,
    usuario: { id_usuario: r.id_usuario, nome: r.usuario_nome },
    entidade: r.entidade,
    id_registro: r.id_registro,
    acao: r.acao,
    campo_alterado: r.campo_alterado,
    valor_anterior: r.valor_anterior,
    valor_novo: r.valor_novo,
    data_hora: r.data_hora,
  }));
}

module.exports = { registrarLog, listarLogs };