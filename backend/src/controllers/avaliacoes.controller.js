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
    if (!req.usuario.id_usuario) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const erros = validarBody(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ message: 'Erro de validação.', errors: erros });
    }

    const resultado = await avaliacoesService.criarAvaliacao(req.body, req.usuario.id_usuario);
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Erro interno ao criar avaliação.'
    });
  }
}

async function listarAvaliacoes(req, res) {
  try {
    const avaliacoes = await avaliacoesService.listarAvaliacoes();
    return res.status(200).json(avaliacoes);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao listar avaliações.' });
  }
}

module.exports = {
  criarAvaliacao,
  listarAvaliacoes
};