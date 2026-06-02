require('dotenv').config();

const limiarMasculino = process.env.LIMIAR_MASCULINO;
const limiarFeminino = process.env.LIMIAR_FEMININO;

function obterLimiarPorSexo(sexo) {
  if (sexo === 'M') {
    return limiarMasculino;
  }

  if (sexo === 'F') {
    return limiarFeminino;
  }

  return null;
}

function calcularScore(sexo, sintomasAtivos, respostas) {
  const limiarUtilizado = obterLimiarPorSexo(sexo);

  const sintomasPorId = new Map();

  sintomasAtivos.forEach((sintoma) => {
    sintomasPorId.set(Number(sintoma.id_sintoma), sintoma);
  });

  let somaPesosPresentes = 0;
  let somaPesosTotais = 0;

  respostas.forEach((resposta) => {
    const sintoma = sintomasPorId.get(Number(resposta.id_sintoma));

    if (!sintoma) {
      return;
    }

    const peso = Number(sintoma.peso || 0);

    somaPesosTotais += peso;

    if (resposta.presente === true) {
      somaPesosPresentes += peso;
    }
  });

  const score = somaPesosTotais > 0
    ? somaPesosPresentes / somaPesosTotais
    : 0;

  const scoreArredondado = Number(score.toFixed(2));

  const resultado = scoreArredondado >= limiarUtilizado
    ? 'ENCAMINHAR'
    : 'NAO_ENCAMINHAR';

  const recomendacao = resultado === 'ENCAMINHAR'
    ? 'Encaminhar para teste genético confirmatório.'
    : 'Não encaminhar neste momento. Manter acompanhamento clínico se necessário.';

  return {
    score: scoreArredondado,
    limiar_utilizado: limiarUtilizado,
    resultado,
    recomendacao
  };
}

module.exports = {
  calcularScore
};