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

async function criarPaciente(dados, idUsuario, contexto = {}) {
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
    `
    INSERT INTO pacientes (
      nome,
      cpf,
      data_nascimento,
      idade,
      sexo,
      telefone,
      responsavel,
      observacoes,
      ativo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      nome,
      cpf,
      data_nascimento,
      idade,
      sexo,
      telefone,
      responsavel,
      observacoes,
      true
    ]
  );

  const paciente = await buscarPacientePorId(result.insertId);

  await logsService.registrarAuditoria({
    id_usuario: idUsuario,
    entidade: 'PACIENTE',
    id_registro: result.insertId,
    acao: 'CRIACAO',
    dados_anteriores: null,
    dados_novos: paciente,
    rota_backend: contexto.rotaBackend || null,
    metodo_http: contexto.metodoHttp || null,
    ip_origem: contexto.ipOrigem || null,
    user_agent: contexto.userAgent || null,
  });

  return paciente;
}

async function atualizarPaciente(id, dados, idUsuario, contexto = {}) {
  const pacienteAnterior = await buscarPacientePorId(id);

  if (!pacienteAnterior) {
    return null;
  }

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
    `
    UPDATE pacientes
    SET nome = ?,
        cpf = ?,
        data_nascimento = ?,
        idade = ?,
        sexo = ?,
        telefone = ?,
        responsavel = ?,
        observacoes = ?,
        data_atualizacao = NOW()
    WHERE id_paciente = ?
    `,
    [
      nome,
      cpf,
      data_nascimento,
      idade,
      sexo,
      telefone,
      responsavel,
      observacoes,
      id
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const pacienteAtualizado = await buscarPacientePorId(id);

  await logsService.registrarAuditoria({
    id_usuario: idUsuario,
    entidade: 'PACIENTE',
    id_registro: id,
    acao: 'EDICAO',
    dados_anteriores: pacienteAnterior,
    dados_novos: pacienteAtualizado,
    rota_backend: contexto.rotaBackend || null,
    metodo_http: contexto.metodoHttp || null,
    ip_origem: contexto.ipOrigem || null,
    user_agent: contexto.userAgent || null,
  });

  return pacienteAtualizado;
}

async function atualizarStatusPaciente(id, ativo, idUsuario, contexto = {}) {
  const pacienteAnterior = await buscarPacientePorId(id);

  if (!pacienteAnterior) {
    return null;
  }

  const [result] = await db.execute(
    `
    UPDATE pacientes
    SET ativo = ?,
        data_atualizacao = NOW()
    WHERE id_paciente = ?
    `,
    [ativo, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const pacienteAtualizado = await buscarPacientePorId(id);

  await logsService.registrarAuditoria({
    id_usuario: idUsuario,
    entidade: 'PACIENTE',
    id_registro: id,
    acao: ativo ? 'EDICAO' : 'EXCLUSAO',
    dados_anteriores: pacienteAnterior,
    dados_novos: pacienteAtualizado,
    rota_backend: contexto.rotaBackend || null,
    metodo_http: contexto.metodoHttp || null,
    ip_origem: contexto.ipOrigem || null,
    user_agent: contexto.userAgent || null,
  });

  return pacienteAtualizado;
}

module.exports = {
  listarPacientes,
  buscarPacientePorId,
  criarPaciente,
  atualizarPaciente,
  atualizarStatusPaciente,
};