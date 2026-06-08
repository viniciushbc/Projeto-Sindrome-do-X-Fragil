const agendamentosService = require('../services/agendamentos.service');

async function listar(req, res) {
  try {
    const dados = await agendamentosService.listarAgendamentos(req.query);
    return res.status(200).json(dados);
  } catch (e) {
    return res.status(500).json({ message: 'Erro ao listar agendamentos.' });
  }
}

async function criar(req, res) {
  try {
    const { id_paciente, data_agendamento, horario, observacao } = req.body;
    if (!id_paciente || !data_agendamento || !horario) {
      return res.status(400).json({ message: 'id_paciente, data_agendamento e horario são obrigatórios.' });
    }
    const novo = await agendamentosService.criarAgendamento(req.body, req.usuario.id_usuario);
    return res.status(201).json(novo);
  } catch (e) {
    return res.status(500).json({ message: 'Erro ao criar agendamento.' });
  }
}

async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const atualizado = await agendamentosService.atualizarStatus(id, status);
    return res.status(200).json(atualizado);
  } catch (e) {
    return res.status(500).json({ message: 'Erro ao atualizar agendamento.' });
  }
}

async function excluir(req, res) {
  try {
    await agendamentosService.excluirAgendamento(req.params.id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ message: 'Erro ao excluir agendamento.' });
  }
}

module.exports = { listar, criar, atualizarStatus, excluir };