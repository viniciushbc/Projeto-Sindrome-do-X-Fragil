const { pool: db } = require('../database/connection');

async function calcularScore({ sexo, respostas }) {
  const [pesos] = await db.execute(
    `SELECT ps.id_sintoma, ps.peso FROM pesos_sintomas ps WHERE ps.sexo = ? AND ps.aplicavel = true`,
    [sexo]
  );

  const [limiares] = await db.execute(
    `SELECT valor FROM limiares WHERE sexo = ? AND ativo = true LIMIT 1`,
    [sexo]
  );

  if (limiares.length === 0) {
    throw { status: 500, message: `Limiar não encontrado para sexo: ${sexo}` };
  }

  const limiarUtilizado = Number(limiares[0].valor);

  const pesosPorId = new Map();
  pesos.forEach((p) => {
    pesosPorId.set(Number(p.id_sintoma), Number(p.peso));
  });

  let score = 0;

  respostas.forEach((resposta) => {
    const peso = pesosPorId.get(Number(resposta.id_sintoma));
    if (peso === undefined) return;

    if (resposta.presente === true) {
      score += peso;
    }
  });

  const scoreArredondado = Number(score.toFixed(3));

  const resultado = scoreArredondado >= limiarUtilizado ? 'ENCAMINHAR' : 'NAO_ENCAMINHAR';

  const recomendacao =
    resultado === 'ENCAMINHAR'
      ? 'Encaminhar para teste genético confirmatório.'
      : 'Triagem não indica encaminhamento prioritário no momento, sem descartar avaliação médica.';

  return {
    score: scoreArredondado,
    limiar_utilizado: limiarUtilizado,
    resultado,
    recomendacao,
  };
}

module.exports = { calcularScore };