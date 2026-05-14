require('dotenv').config();

const app = require('./src/app.js')

const {testConnection} = require('./src/database/connection.js')

const PORT = process.env.PORT || 3000;

// quando o banco ficar pronto, tirar o comentario
// async function startServer(){
//     await testConnection();


    app.listen(PORT, ()=>{
        console.log("Rodando na porta: ", PORT)
        console.log(`Documentação da API em: http://localhost:${PORT}/swagger`)
    })
//}

//startServer();