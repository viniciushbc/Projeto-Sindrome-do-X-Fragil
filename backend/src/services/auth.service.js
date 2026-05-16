const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {pool: db} = require('../database/connection');


// Funcão de login
async function login(login, senha){
    if(!login || !senha){
        throw {
            status: 400,
            message: 'Login e senha são obrigatórios.'
        }
    }

    const [usuarios] = await db.query(
        `
            SELECT
                  id_usuario
                , nome
                , email
                , cpf
                , senha_hash
                , tipo_usuario
                , ativo
            FROM usuarios
            WHERE email = ? OR cpf = ?
            LIMIT 1
        `,
        [login, login] 
        // isso daqui subsitui o "?" da query, ou seja o login pode ser um email ou cpf
        // a ideia de usar "?" na query é evitar sql injection
    );

    // se não foi encontrado usuário com os dados informados
    if(usuarios.length === 0){
        throw {
            status: 401,
            message: 'Credenciais inválidas.'
        }
    };


    const usuario = usuarios[0];

    // verifica se o usuário está ativo (tem a coluna ativo=1 no banco)
    if(!usuario.ativo) {
        throw {
            status: 403,
            message: 'Usuário desativado.'
        }
    };

    // compara a senha que foi enviada com a senha do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if(!senhaValida){
        throw {
            status: 401,
            message: 'Senha incorreta.'
        }
    }

    // gera o token de acesso do usuario com suas informações
    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            tipo_usuario: usuario.tipo_usuario
        },
        process.env.JWT_SECRET, // chave secreta para assinar o token
        {
            expiresIn: process.env.JWT_EXPIRES_IN ||'8h'
        }
    )

    return {
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario
        }
    };
}

// exporta a função pra o controller usar
module.exports = {
    login
}