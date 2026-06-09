const avaliacoesService = require('../services/avaliacoes.service');

function validarBody(body) {
  const erros = [];

  if (!body.id_paciente) erros.push('id_paciente é obrigatório.');
  if (!Array.isArray(body.respostas)) erros.push('respostas deve ser um array.');
  if (Array.isArray(body.respostas) && body.respostas.length === 0)
    erros.push('respostas deve conter ao menos uma resposta.');

  if (Array.isArray(body.respostas)) {
    const idsSintomas = new Set();
    body.respostas.forEach((resposta, index) => {
      if (!resposta.id_sintoma) erros.push(`respostas[${index}].id_sintoma é obrigatório.`);
      if (resposta.presente === undefined || resposta.presente === null)
        erros.push(`respostas[${index}].presente é obrigatório.`);
      if (typeof resposta.presente !== 'boolean')
        erros.push(`respostas[${index}].presente deve ser true ou false.`);
      if (resposta.id_sintoma) {
        if (idsSintomas.has(resposta.id_sintoma))
          erros.push(`Sintoma ${resposta.id_sintoma} foi enviado mais de uma vez.`);
        idsSintomas.add(resposta.id_sintoma);
      }
    });
  }

  return erros;
}

async function criarAvaliacao(req, res) {
  try {
    const erros = validarBody(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ message: 'Erro de validação.', details: erros });
    }

    const resultado = await avaliacoesService.criarAvaliacao(req.body, req.usuario.id_usuario);
    return res.status(201).json({ message: 'Avaliação criada com sucesso.', data: resultado });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Erro interno ao criar avaliação.',
      details: [],
    });
  }
}

// (GET /avaliacoes)
async function listarAvaliacoes(req, res) {
  try {
    const avaliacoes = await avaliacoesService.listarAvaliacoes(req.usuario);
    return res.status(200).json(avaliacoes);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao listar avaliações.', details: [] });
  }
}

async function buscarAvaliacoesPorPaciente(req, res) {
  try {
    const { idPaciente } = req.params;
    const avaliacoes = await avaliacoesService.buscarAvaliacoesPorPaciente(idPaciente, req.usuario);
    return res.status(200).json(avaliacoes);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Erro interno ao buscar avaliações.',
      details: [],
    });
  }
}

async function buscarAvaliacaoPorId(req, res) {
  try {
    const { id } = req.params;
    const avaliacao = await avaliacoesService.buscarAvaliacaoPorId(id, req.usuario);
    return res.status(200).json(avaliacao);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Erro interno ao buscar avaliação.',
      details: [],
    });
  }
}

module.exports = { criarAvaliacao, listarAvaliacoes, buscarAvaliacoesPorPaciente, buscarAvaliacaoPorId };