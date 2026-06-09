const pacientesService = require('../services/pacientes.service');

function validarPaciente(body) {
  const erros = [];

  if (!body.nome || body.nome.trim() === '') erros.push('O campo nome é obrigatório.');
  if (!body.sexo || body.sexo.trim() === '') erros.push('O campo sexo é obrigatório.');
  if (body.sexo && !['M', 'F'].includes(body.sexo)) erros.push('O campo sexo deve ser M ou F.');

  return erros;
}

async function listarPacientes(req, res) {
  try {
    const pacientes = await pacientesService.listarPacientes();
    return res.status(200).json(pacientes);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao listar pacientes.', details: [] });
  }
}

async function buscarPacientePorId(req, res) {
  try {
    const { id } = req.params;
    const paciente = await pacientesService.buscarPacientePorId(id);
    if (!paciente) return res.status(404).json({ message: 'Paciente não encontrado.', details: [] });
    return res.status(200).json(paciente);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao buscar paciente.', details: [] });
  }
}

async function criarPaciente(req, res) {
  try {
    const erros = validarPaciente(req.body);
    if (erros.length > 0) return res.status(400).json({ message: 'Erro de validação.', details: erros });

    const paciente = await pacientesService.criarPaciente(req.body,req.usuario.id_usuario,
      {
        rotaBackend: req.originalUrl,
        metodoHttp: req.method,
        ipOrigem: req.ip,
        userAgent: req.headers['user-agent'],
      }
    );

    return res.status(201).json({ message: 'Paciente criado com sucesso.', data: paciente });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao criar paciente.', details: [] });
  }
}

async function atualizarPaciente(req, res) {
  try {
    const { id } = req.params;
    const erros = validarPaciente(req.body);
    if (erros.length > 0) return res.status(400).json({ message: 'Erro de validação.', details: erros });

    const paciente = await pacientesService.atualizarPaciente(id,req.body,req.usuario.id_usuario,
  {
    rotaBackend: req.originalUrl,
    metodoHttp: req.method,
    ipOrigem: req.ip,
    userAgent: req.headers['user-agent'],
  }
);

    if (!paciente) return res.status(404).json({ message: 'Paciente não encontrado.', details: [] });

    return res.status(200).json({ message: 'Paciente atualizado com sucesso.', data: paciente });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao atualizar paciente.', details: [] });
  }
}

async function atualizarStatusPaciente(req, res) {
  try {
    const { id } = req.params;
    const { ativo } = req.body;

    if (typeof ativo !== 'boolean') {
      return res.status(400).json({ message: 'O campo ativo deve ser booleano.', details: [] });
    }

    const paciente = await pacientesService.atualizarStatusPaciente(id,ativo,req.usuario.id_usuario,
  {
    rotaBackend: req.originalUrl,
    metodoHttp: req.method,
    ipOrigem: req.ip,
    userAgent: req.headers['user-agent'],
  }
);

    if (!paciente) return res.status(404).json({ message: 'Paciente não encontrado.', details: [] });

    return res.status(200).json({
      message: ativo ? 'Paciente ativado com sucesso.' : 'Paciente desativado com sucesso.',
      data: paciente,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao atualizar status.', details: [] });
  }
}

module.exports = { listarPacientes, buscarPacientePorId, criarPaciente, atualizarPaciente, atualizarStatusPaciente };