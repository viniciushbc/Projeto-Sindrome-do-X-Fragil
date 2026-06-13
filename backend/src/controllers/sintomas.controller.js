const sintomasService = require('../services/sintomas.service');

async function listarSintomas(req, res) {
    try {
        const sintomas = await sintomasService.listarSintomas();

        return res.status(200).json(sintomas)
    } catch(error){
        console.error('Erro ao listar sintomas ativos', error);

        return res.status(500).json({
            message: 'Erro ao listar sintomas ativos'
        })
    }
}

module.exports = {
    listarSintomas
}