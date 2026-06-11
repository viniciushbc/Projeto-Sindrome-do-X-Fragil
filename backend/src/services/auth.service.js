const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool: db } = require('../database/connection');

async function login(login, senha) {
  if (!login || !senha) throw { status: 400, message: 'Login e senha são obrigatórios.' };

  const [usuarios] = await db.query(
    `SELECT id_usuario, nome, email, cpf, senha_hash, tipo_usuario, ativo, permissoes
     FROM usuarios WHERE email = ? OR cpf = ? LIMIT 1`,
    [login, login]
  );

  if (usuarios.length === 0) throw { status: 401, message: 'Credenciais inválidas.' };

  const usuario = usuarios[0];
  if (!usuario.ativo) throw { status: 403, message: 'Usuário desativado.' };

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) throw { status: 401, message: 'Senha incorreta.' };

  // parse permissoes
  let permissoes = [];
  if (usuario.tipo_usuario === 'ADMIN') {
    permissoes = ['pacientes','avaliacoes','relatorios','agendamentos','usuarios','logs'];
  } else if (usuario.permissoes) {
    try { permissoes = JSON.parse(usuario.permissoes); } catch { permissoes = ['pacientes','avaliacoes']; }
  } else {
    permissoes = ['pacientes','avaliacoes'];
  }

  const token = jwt.sign(
    { id_usuario: usuario.id_usuario, nome: usuario.nome, tipo_usuario: usuario.tipo_usuario, permissoes },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      permissoes,
    }
  };
}

module.exports = { login };