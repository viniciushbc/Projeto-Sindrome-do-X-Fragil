const relatoriosService = require('../services/relatorio.service');

// GET /relatorios — listagem geral com filtros
async function buscarRelatorios(req, res) {
  try {
    const filtros = {
      dataInicio: req.query.dataInicio || null,
      dataFim:    req.query.dataFim    || null,
      idPaciente: req.query.idPaciente || null,
      idUsuario:  req.query.idUsuario  || null,
      resultado:  req.query.resultado  || null,
    };
    const dados = await relatoriosService.buscarRelatorios(filtros, req.usuario.id_usuario, req.usuario.tipo_usuario);
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Erro interno.', details: error.details || [] });
  }
}

// GET /relatorios/paciente/:idPaciente — histórico completo de um paciente
async function relatorioPorPaciente(req, res) {
  try {
    const { idPaciente } = req.params;
    if (!idPaciente || isNaN(Number(idPaciente)))
      return res.status(400).json({ message: 'idPaciente inválido.', details: [] });

    const dados = await relatoriosService.relatorioPorPaciente(idPaciente, req.usuario.id_usuario, req.usuario.tipo_usuario);
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Erro interno.', details: [] });
  }
}

// GET /relatorios/periodo — todas as avaliações de um período
async function relatorioPorPeriodo(req, res) {
  try {
    const { dataInicio, dataFim } = req.query;
    const dados = await relatoriosService.relatorioPorPeriodo(dataInicio, dataFim, req.usuario.id_usuario, req.usuario.tipo_usuario);
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Erro interno.', details: error.details || [] });
  }
}

// GET /relatorios/resumo — painel geral com dados para gráficos
async function relatorioResumoGeral(req, res) {
  try {
    const dados = await relatoriosService.relatorioResumoGeral(req.usuario.id_usuario, req.usuario.tipo_usuario);
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Erro interno.', details: [] });
  }
}

module.exports = { buscarRelatorios, relatorioPorPaciente, relatorioPorPeriodo, relatorioResumoGeral };