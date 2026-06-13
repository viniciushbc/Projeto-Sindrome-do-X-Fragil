const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middlewares/auth.middleware');
const relatoriosController = require('../controllers/relatorio.controller');

router.get('/resumo',                 authMiddleware, relatoriosController.relatorioResumoGeral);
router.get('/periodo',                authMiddleware, relatoriosController.relatorioPorPeriodo);
router.get('/paciente/:idPaciente',   authMiddleware, relatoriosController.relatorioPorPaciente);
router.get('/',                       authMiddleware, relatoriosController.buscarRelatorios);

module.exports = router;