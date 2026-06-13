const logsService = require('../services/logs.service');

async function listarLogs(req, res) {
  try {
    const filtros = {
      entidade: req.query.entidade || null,
      acao: req.query.acao || null,
      idUsuario: req.query.idUsuario || null,
      dataInicio: req.query.dataInicio || null,
      dataFim: req.query.dataFim || null,
    };

    const logs = await logsService.listarLogs(filtros);
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Erro interno ao buscar logs.',
      details: [],
    });
  }
}

module.exports = { listarLogs };