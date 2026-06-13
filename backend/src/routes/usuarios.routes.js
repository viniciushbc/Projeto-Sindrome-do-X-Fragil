const {Router} = require('express')

const router = Router();

const usuariosController = require('../controllers/usuarios.controller')

const authMiddleware = require('../middlewares/auth.middleware')

const adminMiddleware = require('../middlewares/admin.middleware')

// Middleware de autenticacao
router.use(authMiddleware);

// Rotas

router.get('/', adminMiddleware, usuariosController.listarUsuarios)
router.get('/:id', adminMiddleware, usuariosController.buscarUsuarioPorId)
router.post('/', adminMiddleware, usuariosController.criarUsuario)
router.put('/:id', adminMiddleware, usuariosController.atualizarUsuario)
router.patch('/:id/status', adminMiddleware, usuariosController.atualizarStatusUsuario)

module.exports = router;