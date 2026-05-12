const {Router} = require('express')

const router = Router()

// Rota HEALTH pra verificar o status da API
router.get('/', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        message: 'API do Sistema de Triagem em execução'
    })
})

module.exports = router;