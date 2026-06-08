const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middlewares/auth.middleware');
const relatoriosController = require('../controllers/relatorio.controller');

router.get('/', authMiddleware, relatoriosController.buscarRelatorios);

module.exports = router;