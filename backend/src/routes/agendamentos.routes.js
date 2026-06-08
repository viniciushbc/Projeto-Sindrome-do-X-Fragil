const { Router } = require('express');
const router = Router();
const auth = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/agendamentos.controller');

router.get('/',        auth, ctrl.listar);
router.post('/',       auth, ctrl.criar);
router.patch('/:id',   auth, ctrl.atualizarStatus);
router.delete('/:id',  auth, ctrl.excluir);

module.exports = router;