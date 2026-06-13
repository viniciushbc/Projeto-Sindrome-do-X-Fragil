const usuarioService = require('../services/usuarios.service');

const TIPOS_USUARIOS = ['ADMIN', 'PADRAO'];

function idValido(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

function validarUsuario(body) {
  const erros = [];

  if (!body.nome || body.nome.trim() === '') erros.push('Nome é obrigatório.');
  if (!body.email || body.email.trim() === '') erros.push('E-mail é obrigatório.');
  if (!body.senha || body.senha.trim() === '') erros.push('Senha é obrigatória.');
  if (!body.tipo_usuario || body.tipo_usuario.trim() === '') erros.push('Tipo do usuário é obrigatório.');
  if (body.tipo_usuario && !TIPOS_USUARIOS.includes(body.tipo_usuario))
    erros.push('Tipo do usuário deve ser ADMIN ou PADRAO.');

  return erros;
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao listar usuários.', details: [] });
  }
}

async function buscarUsuarioPorId(req, res) {
  try {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido.', details: [] });

    const usuario = await usuarioService.buscarUsuarioPorId(id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado.', details: [] });

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao buscar usuário.', details: [] });
  }
}

async function criarUsuario(req, res) {
  try {
    const erros = validarUsuario(req.body);
    if (erros.length > 0) return res.status(400).json({ message: 'Erro de validação.', details: erros });

    const jaExiste = await usuarioService.buscarUsuarioPorEmail(req.body.email);
    if (jaExiste) return res.status(400).json({ message: 'E-mail já cadastrado.', details: [] });

    const usuario = await usuarioService.criarUsuario(req.body, req.usuario.id_usuario);
    return res.status(201).json({ message: 'Usuário criado com sucesso.', data: usuario });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao criar usuário.', details: [] });
  }
}

async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido.', details: [] });

    const usuarioExistente = await usuarioService.buscarUsuarioPorId(id);
    if (!usuarioExistente) return res.status(404).json({ message: 'Usuário não encontrado.', details: [] });

    const erros = validarUsuario(req.body);
    if (erros.length > 0) return res.status(400).json({ message: 'Erro de validação.', details: erros });

    if (req.body.email) {
      const jaExiste = await usuarioService.buscarUsuarioPorEmail(req.body.email);
      if (jaExiste && Number(jaExiste.id_usuario) !== Number(id)) {
        return res.status(400).json({ message: 'E-mail já cadastrado por outro usuário.', details: [] });
      }
    }

    const usuario = await usuarioService.atualizarUsuario(id, req.body, req.usuario.id_usuario);
    return res.status(200).json({ message: 'Usuário atualizado com sucesso.', data: usuario });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao atualizar usuário.', details: [] });
  }
}

async function atualizarStatusUsuario(req, res) {
  try {
    const { id } = req.params;
    const { ativo } = req.body;

    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido.', details: [] });
    if (typeof ativo !== 'boolean') return res.status(400).json({ message: 'O campo ativo deve ser booleano.', details: [] });

    const existente = await usuarioService.buscarUsuarioPorId(id);
    if (!existente) return res.status(404).json({ message: 'Usuário não encontrado.', details: [] });

    const usuario = await usuarioService.atualizarStatusUsuario(id, ativo, req.usuario.id_usuario);
    return res.status(200).json({
      message: ativo ? 'Usuário ativado com sucesso.' : 'Usuário desativado com sucesso.',
      data: usuario,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao atualizar status.', details: [] });
  }
}

module.exports = { listarUsuarios, buscarUsuarioPorId, criarUsuario, atualizarUsuario, atualizarStatusUsuario };