const bcrypt = require('bcrypt');
const { pool: db } = require('../database/connection');
const logsService = require('./logs.service');

const SALT_ROUNDS = 10;

function removerSenha(usuario) {
  if (!usuario) return null;
  const { senha_hash, senha, ...usuarioSemSenha } = usuario;
  return { ...usuarioSemSenha, ativo: Boolean(usuarioSemSenha.ativo) };
}

async function listarUsuarios() {
  const [rows] = await db.execute(
    `SELECT id_usuario, nome, email, cpf, tipo_usuario, crm, especialidade, instituicao, cargo, ativo
     FROM usuarios ORDER BY nome ASC`
  );
  return rows.map(removerSenha);
}

async function buscarUsuarioPorId(id) {
  const [rows] = await db.execute(
    `SELECT id_usuario, nome, email, cpf, tipo_usuario, crm, especialidade, instituicao, cargo, ativo
     FROM usuarios WHERE id_usuario = ? LIMIT 1`,
    [id]
  );
  return removerSenha(rows[0]);
}

async function buscarUsuarioPorEmail(email) {
  const [rows] = await db.execute(
    `SELECT id_usuario, nome, email, cpf, tipo_usuario, crm, especialidade, instituicao, cargo, ativo, senha_hash
     FROM usuarios WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function criarUsuario(dados, idUsuarioResponsavel) {
  const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

  const [result] = await db.execute(
    `INSERT INTO usuarios (nome, email, cpf, senha_hash, tipo_usuario, crm, especialidade, instituicao, cargo, ativo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dados.nome,
      dados.email,
      dados.cpf || null,
      senhaHash,
      dados.tipo_usuario,
      dados.crm || null,
      dados.especialidade || null,
      dados.instituicao || null,
      dados.cargo || null,
      true,
    ]
  );

  const usuario = await buscarUsuarioPorId(result.insertId);

  if (idUsuarioResponsavel) {
    await logsService.registrarLog({
      id_usuario: idUsuarioResponsavel,
      entidade: 'USUARIO',
      id_registro: result.insertId,
      acao: 'CRIACAO',
    });
  }

  return usuario;
}

async function atualizarUsuario(id, dados, idUsuarioResponsavel) {
  const campos = [];
  const valores = [];

  const chavesAtualizaveis = ['nome', 'email', 'cpf', 'tipo_usuario', 'crm', 'especialidade', 'instituicao', 'cargo'];

  chavesAtualizaveis.forEach((chave) => {
    if (dados[chave] !== undefined) {
      campos.push(`${chave} = ?`);
      valores.push(dados[chave]);
    }
  });

  if (dados.senha) {
    const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);
    campos.push('senha_hash = ?');
    valores.push(senhaHash);
  }

  if (campos.length === 0) {
    return buscarUsuarioPorId(id);
  }

  valores.push(id);

  await db.execute(
    `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`,
    valores
  );

  const usuarioAtualizado = await buscarUsuarioPorId(id);

  if (idUsuarioResponsavel) {
    await logsService.registrarLog({
      id_usuario: idUsuarioResponsavel,
      entidade: 'USUARIO',
      id_registro: id,
      acao: 'EDICAO',
    });
  }

  return usuarioAtualizado;
}

async function atualizarStatusUsuario(id, ativo, idUsuarioResponsavel) {
  await db.execute(
    `UPDATE usuarios SET ativo = ? WHERE id_usuario = ?`,
    [ativo, id]
  );

  if (idUsuarioResponsavel) {
    await logsService.registrarLog({
      id_usuario: idUsuarioResponsavel,
      entidade: 'USUARIO',
      id_registro: id,
      acao: 'DESATIVACAO',
      campo_alterado: 'ativo',
      valor_anterior: !ativo,
      valor_novo: ativo,
    });
  }

  return buscarUsuarioPorId(id);
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  criarUsuario,
  atualizarUsuario,
  atualizarStatusUsuario,
};