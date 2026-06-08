const relatoriosService = require('../services/relatorio.service');

async function buscarRelatorios(req, res) {
  try {
    const filtros = {
      dataInicio:  req.query.dataInicio  || null,
      dataFim:     req.query.dataFim     || null,
      idPaciente:  req.query.idPaciente  || null,
      idUsuario:   req.query.idUsuario   || null,
      resultado:   req.query.resultado   || null,
    };

    const dados = await relatoriosService.buscarRelatorios(
      filtros,
      req.usuario.id_usuario,
      req.usuario.tipo_usuario
    );

    return res.status(200).json(dados);
  } catch (error) {
    console.error('[relatorios]', error);
    return res.status(500).json({ message: 'Erro interno ao buscar relatórios.' });
  }
}

module.exports = { buscarRelatorios };