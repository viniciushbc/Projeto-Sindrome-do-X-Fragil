const express = require('express');

const cors = require('cors');

const healthRoute = require('./routes/health.routes')
const swaggerRoute = require('./routes/swagger.routes')

const app = express();

//middlewares
app.use(cors());
app.use(express.json()); //interpreta as requisicoes como json
app.use(express.urlencoded({extended: true}));// interpreta os dados de formularios html

// rotas 
app.use('/health', healthRoute);
app.use('/swagger', swaggerRoute);


// middlewares para rotas nao encontradas & erros internos no server (404 e 500)
app.use((req, res)=> {
    return res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada'
    })
});

app.use((err, req, res, next)=>{
    console.log("Erro Interno: ", err);
    return res.status(500).json({
        status: 'error',
        message: 'Erro interno no servidor'
    })
})

// exportando
module.exports = app;