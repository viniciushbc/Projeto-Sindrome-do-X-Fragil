const { pool: db } = require('../database/connection');
const logsService = require('./logs.service');

async function listarPacientes() {
  const [rows] = await db.execute(
    `SELECT * FROM pacientes ORDER BY nome ASC`
  );
  return rows;
}

async function buscarPacientePorId(id) {
  const [rows] = await db.execute(
    `SELECT * FROM pacientes WHERE id_paciente = ? LIMIT 1`,
    [id]
  );
  return rows[0];
}

async function criarPaciente(dados, idUsuario) {
  const {
    nome,
    cpf = null,
    data_nascimento = null,
    idade = null,
    sexo,
    telefone = null,
    responsavel = null,
    observacoes = null,
  } = dados;

  const [result] = await db.execute(
    `INSERT INTO pacientes (nome, cpf, data_nascimento, idade, sexo, telefone, responsavel, observacoes, ativo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, cpf, data_nascimento, idade, sexo, telefone, responsavel, observacoes, true]
  );

  const paciente = await buscarPacientePorId(result.insertId);

  await logsService.registrarLog({
    id_usuario: idUsuario,
    entidade: 'PACIENTE',
    id_registro: result.insertId,
    acao: 'CRIACAO',
  });

  return paciente;
}

async function atualizarPaciente(id, dados, idUsuario) {
  const pacienteAnterior = await buscarPacientePorId(id);

  const {
    nome,
    cpf = null,
    data_nascimento = null,
    idade = null,
    sexo,
    telefone = null,
    responsavel = null,
    observacoes = null,
  } = dados;

  const [result] = await db.execute(
    `UPDATE pacientes SET nome=?, cpf=?, data_nascimento=?, idade=?, sexo=?, telefone=?, responsavel=?, observacoes=?
     WHERE id_paciente=?`,
    [nome, cpf, data_nascimento, idade, sexo, telefone, responsavel, observacoes, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const pacienteAtualizado = await buscarPacientePorId(id);

  const campos = ['nome', 'cpf', 'sexo', 'telefone', 'responsavel', 'observacoes'];
  for (const campo of campos) {
    const anterior = pacienteAnterior ? pacienteAnterior[campo] : null;
    const novo = pacienteAtualizado[campo];
    if (String(anterior) !== String(novo)) {
      await logsService.registrarLog({
        id_usuario: idUsuario,
        entidade: 'PACIENTE',
        id_registro: id,
        acao: 'EDICAO',
        campo_alterado: campo,
        valor_anterior: anterior,
        valor_novo: novo,
      });
    }
  }

  return pacienteAtualizado;
}

async function atualizarStatusPaciente(id, ativo, idUsuario) {
  const [result] = await db.execute(
    `UPDATE pacientes SET ativo=? WHERE id_paciente=?`,
    [ativo, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  await logsService.registrarLog({
    id_usuario: idUsuario,
    entidade: 'PACIENTE',
    id_registro: id,
    acao: 'DESATIVACAO',
    campo_alterado: 'ativo',
    valor_anterior: !ativo,
    valor_novo: ativo,
  });

  return buscarPacientePorId(id);
}

module.exports = {
  listarPacientes,
  buscarPacientePorId,
  criarPaciente,
  atualizarPaciente,
  atualizarStatusPaciente,
};