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

module.exports = {
    listarSintomas
}