// CRUD de usuários

const bcrypt = require('bcrypt')
const db = require('../database/connection')

const salt_rounds = 10

function removerSenha(usuario){
  if(!usuario){
    return null;
  }

  // removendo os campos 'senha_hash' e 'senha' do objeto do usuario
  const { senha_hash, senha, ...usuarioSemSenha } = usuario;

  return {
    ...usuarioSemSenha,
    ativo: Boolean(usuarioSemSenha.ativo)
  }
}

// GET /users
async function listarUsuarios(){
    
  const [rows] = await db.execute(`
    SELECT
      id_usuario,
      nome,
      email,
      cpf,
      tipo_usuario,
      crm,
      especialidade,
      instituicao,
      cargo,
      ativo
    FROM usuarios
    ORDER BY nome ASC
  `);

  return rows.map(removerSenha);
}

// GET /users/id
async function buscarUsuarioPorId(id){
  const [rows] = await db.execute(
    `
    SELECT
      id_usuario,
      nome,
      email,
      cpf,
      tipo_usuario,
      crm,
      especialidade,
      instituicao,
      cargo,
      ativo
    FROM usuarios
    WHERE id_usuario = ?
    LIMIT 1
  `,
    [id]
  )

  return removerSenha(rows[0]);
}

// GET /users/email
async function buscarUsuarioPorEmail(email){
  const [rows] = db.execute(
  `
    SELECT
      id_usuario,
      nome,
      email,
      cpf,
      tipo_usuario,
      crm,
      especialidade,
      instituicao,
      cargo,
      ativo
    FROM usuarios
    WHERE email = ?
    LIMIT 1
  `,
    [email]
  )

  return removerSenha(rows[0]);
}


// POST /users
async function criarUsuario(dados){
  const senhaHash = await bcrypt.hash(dados.senha, salt_rounds);

  const [result] = await db.execute(
    `
      INSERT INTO usuarios (
        nome,
        email,
        cpf,
        senha_hash,
        tipo_usuario,
        crm,
        especialidade,
        instituicao,
        cargo,
        ativo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
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

  return buscarUsuarioPorId(result.insertId);;

}

// PUT /users/id
async function atualizarUsuario(id, dados){
  const chavesPraAtualizar = [];
  const valores = [];

  const chavesAtualizaveis = [
    'nome',
    'email',
    'cpf',
    'tipo_usuario',
    'crm',
    'especialidade',
    'instituicao',
    'cargo',
  ];

  chavesAtualizaveis.forEach((chave)=> {
    if(dados[chave] !== undefined){
      chavesPraAtualizar.push(`${campo} = ?`);
      valores.push(dados[campo])
    }
  })

  if(dados.senha) {
    const senhaHash = await bcrypt.hash(dados.senha, salt_rounds);
    chavesPraAtualizar.push(`senha_hash = ?`);
    valores.push(senhaHash);
  }

  if(chavesPraAtualizar.length === 0){
    return buscarUsuarioPorId(id);
  }

  valores.push(id);

  await db.execute(
    `
    UPDATE usuarios
    SET ${campos.join(', ')}
    WHERE id_usuario = ?
    `,
    valores
  );

  return buscarUsuarioPorId(id);

}

// PATCH /users/id
// a ideia é não ter uma REMOÇÃO definitiva, se quiser remover um usuário, basta desativá-lo.
async function atualizarStatusUsuario(id, ativo) {
  await db.execute(
    `
    UPDATE usuarios
    SET ativo = ?
    WHERE id_usuario = ?
    `,
    [ativo, id]
  );

  return buscarUsuarioPorId(id);
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  criarUsuario,
  atualizarUsuario,
  atualizarStatusUsuario
}