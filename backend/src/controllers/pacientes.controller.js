const pacientesService = require('../services/pacientes.service')

function validarPaciente(body){
    const erros = [];

    if(!body.nome || body.nome.trim()===''){
        erros.push('O campo do nome é obrigatório.')
    }

    if (!body.sexo || body.sexo.trim()===''){
        erros.push('O campo sexo é obrigatório.')
    }

    if(body.sexo && !['M', 'F'].includes(body.sexo)){
        erros.push('O campo sexo deve ser M ou F.')
    }

    return erros;
}


// GET /pacientes
async function listarPacientes(req,res){
    try{
        const pacientes = await pacientesService.listarPacientes();

        return res.status(200).json(pacientes);
    } catch( error){
        console.error('Erro ao listar pacientes: ', error);
        return res.status(500).json({
            message: 'Erro interno ao listar pacientes.'
        });
    }
}

// GET /pacientes:id
async function buscarPacientePorId(req,res) {
    try {
        const {id} = req.params;

        const paciente = await pacientesService.buscarPacientePorId(id);

        if(!paciente){
            return res.status(404).json({
                message: 'Paciente não encontrado.'
            })
        }

        return res.status(200).json(paciente);
    } catch(error){
        console.error('Erro ao buscar paciente: ',error);

        return res.status(500).json({
            message: 'Erro interno ao buscar paciente.'
        })
    }
}


// POST /pacientes
async function criarPaciente(req,res){
    try{
        const erros = validarPaciente(req.body);

        if(erros.length > 0){
            return res.status(400).json({erros})
        }

        const paciente = await pacientesService.criarPaciente(req.body);

        return res.status(201).json({
            message: 'Paciente criado com sucesso.',
            paciente
        });
    } catch(error){
        console.error('Erro ao criar paciente: ', error);

        return res.status(500).json({
            message: 'Erro interno ao criar paciente.'
        })
    }
}


// PUT /pacientes:id
async function atualizarPaciente(req,res){
    try{
        const {id} = req.params;

        const erros = validarPaciente(req.body);

        if (erros.length > 0){
            return res.status(400).json({erros})
        }

        const paciente = await pacientesService.atualizarPaciente(id, req.body);

        if (!paciente){
            return res.status(404).json({
                message: 'Paciente não encontrado.'
            })
        }

        return res.status(200).json({
            message: 'Paciente atualizado com sucesso.',
            paciente
        })
    } catch(error){
        console.error('Erro ao atualizar paciente: ', error);
        return res.status(500).json({
            message: 'Erro interno ao cadastrar paciente.'
        })
    }
}


// PATCH /pacientes/id/status
async function atualizarStatusPaciente(req,res){
    try{
        const  {id} = req.params;

        const {ativo} = req.body;

        if(typeof ativo != 'boolean'){
            return res.status(400).json({
                message: 'O campo ativo deve ser booleano.'
            })
        }

        const paciente = await pacientesService.atualizarStatusPaciente(id, ativo);

        if(!paciente){
            return res.status(400).json({
                message: 'Paciente não encontrado.'
            })
        }

        return res.status(200).json({
            message: ativo ? 'Paciente ativado com sucesso.' : 'Paciente desativado com sucesso.',
            paciente
        })
    }catch(error){
        console.error('Erro ao atualizar o status do paciente: ', error);
        return res.status(500).json({
            message: 'Erro interno ao atualizar o status do paciente.'
        })
    }
}

module.exports = {
    listarPacientes,
    buscarPacientePorId,
    criarPaciente,
    atualizarPaciente,
    atualizarStatusPaciente
};