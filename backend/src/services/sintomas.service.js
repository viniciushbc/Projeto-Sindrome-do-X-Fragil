const {pool:db} = require('../database/connection')

// GET /sintomas
async function listarSintomas() {
    const [sintomas] = await db.execute(`
        SELECT
            id_sintoma
        , nome
        , descricao
        , ativo
        FROM sintomas
        WHERE ativo = true
        ORDER BY id_sintoma ASC
  `);


  return sintomas;

}

async function listarSintomasAtivosParaCalculo(sexo) {
  const [rows] = await db.execute(
    `
      SELECT
          s.id_sintoma,
          s.nome,
          s.descricao,
          s.ativo,
          ps.peso,
          ps.sexo,
          ps.aplicavel
      FROM sintomas s
      INNER JOIN pesos_sintomas ps
          ON ps.id_sintoma = s.id_sintoma
      WHERE s.ativo = true
        AND ps.aplicavel = true
        AND ps.sexo = ?
    `,
    [sexo]
  );

  return rows;
}

module.exports = {
    listarSintomas,
    listarSintomasAtivosParaCalculo
}