const {Router} = require('express')

const router = Router()

// lib pra interface visual do swagger
const swaggerUI = require('swagger-ui-express')

// importando o JSON da documentação que fizemos criamos no arquivo swagger.js
const swaggerSpec = require('../config/swagger')

// o ".serve" q ja disponibiliza os arquivos estátisco (js e css) da interface grafica
router.use('/', swaggerUI.serve);

// ".setup" monta a pagina usando o nosso arquivo /config/swagger como fonte de dados
router.get('/',swaggerUI.setup(swaggerSpec))

module.exports = router