const {Router} = require('express')

const router = Router();

const pacientesController = require('../controllers/pacientes.controller')

const authMiddleware = require('../middlewares/auth.middleware')

// Middleware de autenticacao
router.use(authMiddleware);

// Rotas

router.get('/', pacientesController.listarPacientes)
router.get('/:id', pacientesController.buscarPacientePorId)
router.post('/', pacientesController.criarPaciente)
router.put('/:id', pacientesController.atualizarPaciente)
router.patch('/:id/status', pacientesController.atualizarStatusPaciente)

module.exports = router;