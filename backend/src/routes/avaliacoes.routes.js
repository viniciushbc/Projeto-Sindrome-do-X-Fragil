const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middlewares/auth.middleware');
const avaliacoesController = require('../controllers/avaliacoes.controller');

router.get('/', authMiddleware, avaliacoesController.listarAvaliacoes);
router.post('/', authMiddleware, avaliacoesController.criarAvaliacao);

module.exports = router;