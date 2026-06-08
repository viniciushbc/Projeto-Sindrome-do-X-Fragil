const { pool: db } = require('../database/connection');

async function listarAgendamentos(filtros = {}) {
  const condicoes = [];
  const valores = [];

  if (filtros.mes && filtros.ano) {
    condicoes.push('MONTH(a.data_agendamento) = ? AND YEAR(a.data_agendamento) = ?');
    valores.push(Number(filtros.mes), Number(filtros.ano));
  }

  if (filtros.idPaciente) {
    condicoes.push('a.id_paciente = ?');
    valores.push(Number(filtros.idPaciente));
  }

  const where = condicoes.length > 0 ? 'WHERE ' + condicoes.join(' AND ') : '';

  const [rows] = await db.execute(`
    SELECT
      a.id_agendamento,
      a.data_agendamento,
      a.horario,
      a.observacao,
      a.status,
      a.data_criacao,
      p.nome  AS paciente_nome,
      p.sexo  AS paciente_sexo,
      u.nome  AS profissional_nome,
      u.id_usuario
    FROM agendamentos a
    INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
    INNER JOIN usuarios  u ON u.id_usuario  = a.id_usuario
    ${where}
    ORDER BY a.data_agendamento ASC, a.horario ASC
  `, valores);

  return rows;
}

async function criarAgendamento(dados, idUsuario) {
  const [result] = await db.execute(`
    INSERT INTO agendamentos (id_paciente, id_usuario, data_agendamento, horario, observacao, status)
    VALUES (?, ?, ?, ?, ?, 'AGENDADO')
  `, [
    dados.id_paciente,
    idUsuario,
    dados.data_agendamento,
    dados.horario,
    dados.observacao || null,
  ]);

  const [rows] = await db.execute(`
    SELECT a.*, p.nome AS paciente_nome, u.nome AS profissional_nome
    FROM agendamentos a
    INNER JOIN pacientes p ON p.id_paciente = a.id_paciente
    INNER JOIN usuarios  u ON u.id_usuario  = a.id_usuario
    WHERE a.id_agendamento = ?
  `, [result.insertId]);

  return rows[0];
}

async function atualizarStatus(id, status) {
  await db.execute(
    'UPDATE agendamentos SET status = ? WHERE id_agendamento = ?',
    [status, id]
  );
  const [rows] = await db.execute(
    'SELECT * FROM agendamentos WHERE id_agendamento = ?', [id]
  );
  return rows[0];
}

async function excluirAgendamento(id) {
  await db.execute('DELETE FROM agendamentos WHERE id_agendamento = ?', [id]);
}

module.exports = { listarAgendamentos, criarAgendamento, atualizarStatus, excluirAgendamento };