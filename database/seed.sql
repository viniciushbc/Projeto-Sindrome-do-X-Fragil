USE sindrome_x_fragil;

-- =========================================================
-- Seed inicial do sistema - LOGIN DE TESTE
-- Login temporário do admin para desenvolvimento: admin@sistemaxfragil.com
-- Senha temporária do admin para desenvolvimento: Admin@123
-- =========================================================

-- 1. Usuário administrador inicial
INSERT INTO usuarios (
    nome,
    email,
    senha_hash,
    tipo_usuario,
    ativo
) VALUES (
    'Administrador',
    'admin@sistemaxfragil.com',
    '$2b$10$TkKvo4rPLPOqjmNOey4K5eeuKANEEn7JGiGJxcPxtVs.Afk7V0Tc.',
    'ADMIN',
    TRUE
) AS novo
ON DUPLICATE KEY UPDATE
    nome = novo.nome,
    senha_hash = novo.senha_hash,
    tipo_usuario = novo.tipo_usuario,
    ativo = novo.ativo;

-- 2. Sintomas
INSERT INTO sintomas (
    nome,
    descricao,
    ativo
)
SELECT dados.nome, NULL, TRUE
FROM (
    SELECT 'Deficiência intelectual' AS nome
    UNION ALL SELECT 'Face alongada ou orelhas de abano'
    UNION ALL SELECT 'Macroorquidismo'
    UNION ALL SELECT 'Hipermobilidade articular'
    UNION ALL SELECT 'Dificuldades de aprendizagem'
    UNION ALL SELECT 'Déficit de atenção'
    UNION ALL SELECT 'Movimentos repetitivos'
    UNION ALL SELECT 'Atraso na fala'
    UNION ALL SELECT 'Hiperatividade'
    UNION ALL SELECT 'Evita contato visual'
    UNION ALL SELECT 'Evita contato físico'
    UNION ALL SELECT 'Agressividade'
) AS dados
WHERE NOT EXISTS (
    SELECT 1
    FROM sintomas s
    WHERE s.nome = dados.nome
);

-- 3. Pesos por sexo
INSERT INTO pesos_sintomas (
    id_sintoma,
    sexo,
    peso,
    aplicavel
)
SELECT
    s.id_sintoma,
    dados.sexo,
    dados.peso,
    dados.aplicavel
FROM (
    SELECT 'Deficiência intelectual' AS nome, 'M' AS sexo, 0.32 AS peso, TRUE AS aplicavel
    UNION ALL SELECT 'Deficiência intelectual', 'F', 0.20, TRUE

    UNION ALL SELECT 'Face alongada ou orelhas de abano', 'M', 0.29, TRUE
    UNION ALL SELECT 'Face alongada ou orelhas de abano', 'F', 0.09, TRUE

    UNION ALL SELECT 'Macroorquidismo', 'M', 0.26, TRUE
    UNION ALL SELECT 'Macroorquidismo', 'F', 0.00, FALSE

    UNION ALL SELECT 'Hipermobilidade articular', 'M', 0.19, TRUE
    UNION ALL SELECT 'Hipermobilidade articular', 'F', 0.04, TRUE

    UNION ALL SELECT 'Dificuldades de aprendizagem', 'M', 0.18, TRUE
    UNION ALL SELECT 'Dificuldades de aprendizagem', 'F', 0.28, TRUE

    UNION ALL SELECT 'Déficit de atenção', 'M', 0.17, TRUE
    UNION ALL SELECT 'Déficit de atenção', 'F', 0.12, TRUE

    UNION ALL SELECT 'Movimentos repetitivos', 'M', 0.17, TRUE
    UNION ALL SELECT 'Movimentos repetitivos', 'F', 0.05, TRUE

    UNION ALL SELECT 'Atraso na fala', 'M', 0.14, TRUE
    UNION ALL SELECT 'Atraso na fala', 'F', 0.01, TRUE

    UNION ALL SELECT 'Hiperatividade', 'M', 0.12, TRUE
    UNION ALL SELECT 'Hiperatividade', 'F', 0.04, TRUE

    UNION ALL SELECT 'Evita contato visual', 'M', 0.06, TRUE
    UNION ALL SELECT 'Evita contato visual', 'F', 0.08, TRUE

    UNION ALL SELECT 'Evita contato físico', 'M', 0.04, TRUE
    UNION ALL SELECT 'Evita contato físico', 'F', 0.07, TRUE

    UNION ALL SELECT 'Agressividade', 'M', 0.01, TRUE
    UNION ALL SELECT 'Agressividade', 'F', 0.02, TRUE
) AS dados
INNER JOIN sintomas s ON s.nome = dados.nome
WHERE NOT EXISTS (
    SELECT 1
    FROM pesos_sintomas ps
    WHERE ps.id_sintoma = s.id_sintoma
      AND ps.sexo = dados.sexo
);

-- 4. Limiares
INSERT INTO limiares (
    sexo,
    valor,
    descricao,
    ativo
) VALUES
    ('M', 0.56, 'Limiar para encaminhamento masculino', TRUE),
    ('F', 0.55, 'Limiar para encaminhamento feminino', TRUE)
AS novo
ON DUPLICATE KEY UPDATE
    valor = novo.valor,
    descricao = novo.descricao,
    ativo = novo.ativo;

-- 5. Pacientes de teste
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
) VALUES
    (
        'João Silva Teste',
        '111.111.111-11',
        '2015-04-10',
        9,
        'M',
        '(41) 99999-1111',
        'Maria Silva',
        'Paciente fictício masculino para testes.',
        TRUE
    ),
    (
        'Ana Souza Teste',
        '222.222.222-22',
        '2016-08-20',
        8,
        'F',
        '(41) 99999-2222',
        'Carlos Souza',
        'Paciente fictício feminino para testes.',
        TRUE
    )
AS novo
ON DUPLICATE KEY UPDATE
    nome = novo.nome,
    data_nascimento = novo.data_nascimento,
    idade = novo.idade,
    sexo = novo.sexo,
    telefone = novo.telefone,
    responsavel = novo.responsavel,
    observacoes = novo.observacoes,
    ativo = novo.ativo;