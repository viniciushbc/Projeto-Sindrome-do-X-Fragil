const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const logsController = require('../controllers/logs.controller');

router.get('/', authMiddleware, adminMiddleware, logsController.listarLogs);

module.exports = router;