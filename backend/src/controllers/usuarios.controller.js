const usuarioService = require('../services/usuarios.service');

const tiposUsuarios = ['ADMIN', 'PADRAO'];

function usuarioEhValido(tipoUsuario){
    return tiposUsuarios.includes(tipoUsuario);
}

function idValido(id){
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

function validarUsuario(body){
    const erros = [];

    if(!body.nome || body.nome.trim() === ''){
        erros.push('Nome é obrigatório.')
    }

    if(!body.email || body.email.trim() === ''){
        erros.push('E-mail é obrigatório.')
    }

    if(!body.senha || body.senha.trim() === ''){
        erros.push('Senha é obrigatória.')
    }

    if(!body.tipo_usuario || body.tipo_usuario.trim() === ''){
        erros.push('Tipo do usuário é obrigatório.')
    }

    if(body.tipo_usuario && !usuarioEhValido(body.tipo_usuario)){
        erros.push('Tipo do usuário deve ser ADMIN ou PADRAO');
    }

    return erros
}

// GET /users
async function listarUsuarios(req, res){
    try{
        const usuarios = await usuarioService.listarUsuarios()

        return res.status(200).json(usuarios);

    } catch(error){
        console.error('Erro ao listar usuários: ', error);

        return res.status(500).json({
            message: 'Erro interno ao listar usuários.'
        })
    }
}

// GET /users/id
async function buscarUsuarioPorId(req, res) {
    try {
        const {id} = req.params;

        if(!idValido(id)){
            return res.status(400).json({
                message: 'ID do usuário inválido.'
            });
        }

        const usuario = await usuarioService.buscarUsuarioPorId(id);

        if(!usuario){
            return res.status(404).json({
                message: 'Usuário não encontrado'
            })
        }

        return res.status(200).json(usuario);


    } catch (error){
        console.error('Erro ao buscar usuário: ', error);

        return res.status(500).json({
            message: 'Erro interno ao buscar usuário.'
        });
    }
}

// POST /users
async function criarUsuario(req,res){
    try{
        const {
            nome,
            email,
            cpf,
            senha,
            tipo_usuario,
            crm,
            especialidade,
            instituicao,
            cargo
        } = req.body;

        const erros = validarUsuario(req.body);


        if(erros.length > 0){
            return res.status(400).json({erros});
        }

        const cadastroJaExiste = await usuarioService.buscarUsuarioPorEmail(email)

        if(cadastroJaExiste) {
            return res.status(400).json({
                message: 'E-mail já cadastrado'
            })
        }


        const usuarioCriado = await usuarioService.criarUsuario({
            nome,
            email,
            cpf,
            senha,
            tipo_usuario,
            crm,
            especialidade,
            instituicao,
            cargo
        });

        return res.status(201).json(usuarioCriado);

    } catch(error){
        console.error("Erro ao criar usuário: ", error)

        return res.status(500).json({
            message: 'Erro interno ao criar usuário'
        })
    }
}

// PUT /users/id
async function atualizarUsuario(req, res){
    try{
        const {id} = req.params
        const {email, tipo_usuario} = req.body

        if(!idValido(id)){
            return res.status(400).json({
                message: 'ID do usuário inválido.'
            })
        }

        const usuarioExistente = await usuarioService.buscarUsuarioPorId(id);

        if(!usuarioExistente){
            return res.status(404).json({
                message: 'Usuário não encontrado.'
            })
        }

        const erros = validarUsuario(req.body);

        if(erros.length > 0){
            return res.status(400).json({erros})
        }

        if (email){

            const cadastroJaExiste = await usuarioService.buscarUsuarioPorEmail(email);

            if(cadastroJaExiste && Number(cadastroJaExiste.id_usuario) !== Number(id)){
                return res.status(400).json({
                    message: 'E-mail já cadastrado por outro usuário'
                })
            }
        }

        const usuarioAtualizado = await usuarioService.atualizarUsuario(id, req.body);

        return res.status(200).json(usuarioAtualizado)

    } catch(error){
        console.error("Erro ao atualizar usuário: ", error)

        return res.status(500).json({
            message: 'Erro interno ao atualizar o usuário.'
        })
    }
}


// PATCH /users/id
async function atualizarStatusUsuario(req,res){
    try {
        const {id} = req.params;
        const {ativo} = req.body;

        if(!idValido(id)){
            return res.status(400).json({
                message: 'ID do usuário inválido.'
            })
        }

        if(typeof ativo !== 'boolean'){
            return res.status(400).json({
                message: 'O campo ativo deve ser booleano.'
            })
        }

        const usuario = await usuarioService.buscarUsuarioPorId(id);

        if(!usuario){
            return res.status(404).json({
                messahe: 'Usuário não encontrado.'
            })
        }

        const usuarioAtualizado = await usuarioService.atualizarStatusUsuario(id, ativo);

        return res.status(200).json(usuarioAtualizado)

    } catch(error){
        console.error("Erro ao atualizar status usuário: ", error)

        return res.status(500).json({
            message: 'Erro interno ao atualizar status usuário'
        })
    }
}

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    atualizarStatusUsuario
}