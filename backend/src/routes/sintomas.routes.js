const {Router} = require('express')

const router = Router();

const sintomasController = require('../controllers/sintomas.controller')

const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, sintomasController.listarSintomas);

module.exports = router;