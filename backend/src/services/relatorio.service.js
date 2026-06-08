const { pool: db } = require('../database/connection');

async function buscarRelatorios(filtros, idUsuarioLogado, tipoUsuario) {
  const condicoes = [];
  const valores = [];

  if (filtros.dataInicio) {
    condicoes.push('a.data_avaliacao >= ?');
    valores.push(filtros.dataInicio + ' 00:00:00');
  }

  if (filtros.dataFim) {
    condicoes.push('a.data_avaliacao <= ?');
    valores.push(filtros.dataFim + ' 23:59:59');
  }

  if (filtros.idPaciente) {
    condicoes.push('a.id_paciente = ?');
    valores.push(Number(filtros.idPaciente));
  }

  if (filtros.resultado && filtros.resultado !== 'TODOS') {
    condicoes.push('a.resultado = ?');
    valores.push(filtros.resultado);
  }

  if (tipoUsuario !== 'ADMIN') {
    condicoes.push('a.id_usuario = ?');
    valores.push(idUsuarioLogado);
  } else if (filtros.idUsuario) {
    condicoes.push('a.id_usuario = ?');
    valores.push(Number(filtros.idUsuario));
  }

  const where = condicoes.length > 0 ? 'WHERE ' + condicoes.join(' AND ') : '';

  const [rows] = await db.execute(`
    SELECT
      a.id_avaliacao,
      a.data_avaliacao,
      a.score,
      a.limiar_utilizado,
      a.resultado,
      a.respondente_nome,
      a.respondente_parentesco,
      p.nome        AS paciente_nome,
      p.sexo        AS paciente_sexo,
      u.nome        AS profissional_nome
    FROM avaliacoes a
    INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
    INNER JOIN usuarios  u ON u.id_usuario  = a.id_usuario
    ${where}
    ORDER BY a.data_avaliacao DESC
  `, valores);

  return rows;
}

module.exports = { buscarRelatorios };