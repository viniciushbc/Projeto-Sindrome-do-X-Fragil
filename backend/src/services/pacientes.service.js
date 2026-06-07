const {pool: db} = require('../database/connection')


// GET /apacientes
async function listarPacientes(){
    const [rows] = await db.execute(
        `
        SELECT *
        FROM pacientes
        ORDER BY nome ASC
        `
    );

    return rows;
}


// GET /pacientes/id
async function buscarPacientePorId(id){
    const [rows] = await db.execute(
        `
        SELECT *
        FROM pacientes
        WHERE id_paciente = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0];

}

// POST /pacientes
// verificar de fato se esses campos devem ser not null
async function criarPaciente(dados){
    const {
        nome,
        cpf = null,
        data_nascimento = null,
        idade = null,
        sexo,
        telefone = null,
        responsavel = null,
        observacoes = null
    } = dados

    const [result] = await db.execute(
        `
        INSERT INTO pacientes (
        nome,
        cpf,
        data_nascimento,
        idade,
        sexo,
        telefone,
        responsavel,
        observacoes,
        ativo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
        nome,
        cpf,
        data_nascimento,
        idade,
        sexo,
        telefone,
        responsavel,
        observacoes,
        true,
        ]    
    );


    return buscarPacientePorId(result.insertId)
}

async function atualizarPaciente(id, dados){
    const {
        nome,
        cpf = null,
        data_nascimento = null,
        idade = null,
        sexo,
        telefone = null,
        responsavel = null,
        observacoes = null
    } = dados;

    const [result] = await db.execute(
        `
        UPDATE pacientes
        SET
            nome = ?,
            cpf = ?,
            data_nascimento = ?,
            idade = ?,
            sexo = ?,
            telefone = ?,
            responsavel = ?,
            observacoes = ?
        WHERE id_paciente = ?
        `,
        [
            nome,
            cpf,
            data_nascimento,
            idade,
            sexo,
            telefone,
            responsavel,
            observacoes,
            id,
        ] 
    );

    if(result.affectedRows === 0){
        return null;
    }

    return buscarPacientePorId(id);

}


async function atualizarStatusPaciente(id, ativo) {
    const [result] = await db.execute(
        `
        UPDATE pacientes
        SET ativo = ?
        WHERE id_paciente = ?
        `,
        [ativo, id]    
    );


    if(result.affectedRows === 0){
        return null;
    }

    return buscarPacientePorId(id);
}


module.exports = {
    listarPacientes,
    buscarPacientePorId,
    criarPaciente,
    atualizarPaciente,
    atualizarStatusPaciente
}