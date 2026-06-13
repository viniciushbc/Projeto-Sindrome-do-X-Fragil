const authService = require('../services/auth.service');


// Chama o servico de login
async function login(req, res){
    try {

        const {login, senha} = req.body;

        const resultado = await authService.login(login, senha);

        return res.status(200).json(resultado);

    }

    catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Erro no servidor interno ao realizar o login.'
        });
    }
}

module.exports = {
    login
}