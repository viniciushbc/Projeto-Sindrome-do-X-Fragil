USE sindrome_x_fragil;

-- =========================================================
-- Seed inicial do sistema
-- Admin:   admin@sistemaxfragil.com   / Admin@123
-- Padrão:  usuario@sistemaxfragil.com / Usuario@123
-- =========================================================

-- 1. Usuário administrador
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, permissoes, ativo)
VALUES (
    'Administrador',
    'admin@sistemaxfragil.com',
    '$2b$10$TkKvo4rPLPOqjmNOey4K5eeuKANEEn7JGiGJxcPxtVs.Afk7V0Tc.',
    'ADMIN',
    '["pacientes","avaliacoes","relatorios","agendamentos","usuarios","logs"]',
    TRUE
) AS novo
ON DUPLICATE KEY UPDATE
    nome        = novo.nome,
    senha_hash  = novo.senha_hash,
    tipo_usuario = novo.tipo_usuario,
    permissoes  = novo.permissoes,
    ativo       = novo.ativo;

-- 1.1 Usuário padrão
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, permissoes, ativo)
VALUES (
    'Usuário Padrão Teste',
    'usuario@sistemaxfragil.com',
    '$2b$10$d0gOqDDfGbDbH2BmGud5CeVV2.MIoqTOE50EHG0xLLIhj9wjMiv0m',
    'PADRAO',
    '["pacientes","avaliacoes"]',
    TRUE
) AS novo
ON DUPLICATE KEY UPDATE
    nome        = novo.nome,
    senha_hash  = novo.senha_hash,
    tipo_usuario = novo.tipo_usuario,
    permissoes  = novo.permissoes,
    ativo       = novo.ativo;

-- 2. Sintomas
INSERT INTO sintomas (nome, descricao, ativo)
SELECT dados.nome, dados.descricao, TRUE
FROM (
    SELECT 'Deficiência intelectual'           AS nome, 'Comprometimento cognitivo variável, de leve a grave.'                              AS descricao
    UNION ALL SELECT 'Face alongada ou orelhas de abano', 'Características fenotípicas faciais associadas à síndrome.'
    UNION ALL SELECT 'Macroorquidismo',                   'Volume testicular aumentado, frequente pós-puberdade.'
    UNION ALL SELECT 'Hipermobilidade articular',         'Amplitude de movimento articular acima do normal.'
    UNION ALL SELECT 'Dificuldades de aprendizagem',      'Dificuldade na aquisição de conteúdos acadêmicos.'
    UNION ALL SELECT 'Déficit de atenção',                'Dificuldade de manter atenção sustentada em tarefas.'
    UNION ALL SELECT 'Movimentos repetitivos',            'Estereotipias motoras como balançar o corpo ou mãos.'
    UNION ALL SELECT 'Atraso na fala',                    'Desenvolvimento da linguagem oral abaixo do esperado para a idade.'
    UNION ALL SELECT 'Hiperatividade',                    'Nível excessivo de atividade motora.'
    UNION ALL SELECT 'Evita contato visual',              'Dificuldade ou recusa em manter olho no olho.'
    UNION ALL SELECT 'Evita contato físico',              'Sensibilidade tátil aumentada ou aversão ao toque.'
    UNION ALL SELECT 'Agressividade',                     'Comportamento agressivo verbal ou físico em situações de frustração.'
) AS dados
WHERE NOT EXISTS (SELECT 1 FROM sintomas s WHERE s.nome = dados.nome);

-- 3. Pesos por sexo
INSERT INTO pesos_sintomas (id_sintoma, sexo, peso, aplicavel)
SELECT s.id_sintoma, dados.sexo, dados.peso, dados.aplicavel
FROM (
    SELECT 'Deficiência intelectual'           AS nome, 'M' AS sexo, 0.32 AS peso, TRUE AS aplicavel
    UNION ALL SELECT 'Deficiência intelectual',           'F', 0.20, TRUE
    UNION ALL SELECT 'Face alongada ou orelhas de abano', 'M', 0.29, TRUE
    UNION ALL SELECT 'Face alongada ou orelhas de abano', 'F', 0.09, TRUE
    UNION ALL SELECT 'Macroorquidismo',                   'M', 0.26, TRUE
    UNION ALL SELECT 'Macroorquidismo',                   'F', 0.00, FALSE
    UNION ALL SELECT 'Hipermobilidade articular',         'M', 0.19, TRUE
    UNION ALL SELECT 'Hipermobilidade articular',         'F', 0.04, TRUE
    UNION ALL SELECT 'Dificuldades de aprendizagem',      'M', 0.18, TRUE
    UNION ALL SELECT 'Dificuldades de aprendizagem',      'F', 0.28, TRUE
    UNION ALL SELECT 'Déficit de atenção',                'M', 0.17, TRUE
    UNION ALL SELECT 'Déficit de atenção',                'F', 0.12, TRUE
    UNION ALL SELECT 'Movimentos repetitivos',            'M', 0.17, TRUE
    UNION ALL SELECT 'Movimentos repetitivos',            'F', 0.05, TRUE
    UNION ALL SELECT 'Atraso na fala',                    'M', 0.14, TRUE
    UNION ALL SELECT 'Atraso na fala',                    'F', 0.01, TRUE
    UNION ALL SELECT 'Hiperatividade',                    'M', 0.12, TRUE
    UNION ALL SELECT 'Hiperatividade',                    'F', 0.04, TRUE
    UNION ALL SELECT 'Evita contato visual',              'M', 0.06, TRUE
    UNION ALL SELECT 'Evita contato visual',              'F', 0.08, TRUE
    UNION ALL SELECT 'Evita contato físico',              'M', 0.04, TRUE
    UNION ALL SELECT 'Evita contato físico',              'F', 0.07, TRUE
    UNION ALL SELECT 'Agressividade',                     'M', 0.01, TRUE
    UNION ALL SELECT 'Agressividade',                     'F', 0.02, TRUE
) AS dados
INNER JOIN sintomas s ON s.nome = dados.nome
WHERE NOT EXISTS (
    SELECT 1 FROM pesos_sintomas ps
    WHERE ps.id_sintoma = s.id_sintoma AND ps.sexo = dados.sexo
);

-- 4. Limiares
INSERT INTO limiares (sexo, valor, descricao, ativo)
VALUES
    ('M', 0.56, 'Limiar para encaminhamento masculino', TRUE),
    ('F', 0.55, 'Limiar para encaminhamento feminino',  TRUE)
AS novo
ON DUPLICATE KEY UPDATE
    valor     = novo.valor,
    descricao = novo.descricao,
    ativo     = novo.ativo;

-- 5. Pacientes de teste
INSERT INTO pacientes (nome, cpf, data_nascimento, idade, sexo, telefone, responsavel, observacoes, ativo)
VALUES
    ('João Silva Teste',   '111.111.111-11', '2015-04-10', 9,  'M', '(41) 99999-1111', 'Maria Silva',   'Paciente fictício masculino para testes.', TRUE),
    ('Ana Souza Teste',    '222.222.222-22', '2016-08-20', 8,  'F', '(41) 99999-2222', 'Carlos Souza',  'Paciente fictício feminino para testes.',  TRUE)
AS novo
ON DUPLICATE KEY UPDATE
    nome             = novo.nome,
    data_nascimento  = novo.data_nascimento,
    idade            = novo.idade,
    sexo             = novo.sexo,
    telefone         = novo.telefone,
    responsavel      = novo.responsavel,
    observacoes      = novo.observacoes,
    ativo            = novo.ativo;

-- 6. Pacientes adicionais
INSERT INTO pacientes (nome, cpf, data_nascimento, idade, sexo, telefone, responsavel, observacoes, ativo)
SELECT *
FROM (
    SELECT 'Mariana Lima Teste'      AS nome,'444.444.444-44' AS cpf,'2017-01-15' AS data_nascimento, 9  AS idade,'F' AS sexo,'(41) 99999-4444' AS telefone,'Fernanda Lima'    AS responsavel,'Paciente fictício adicional para testes.' AS observacoes, TRUE AS ativo
    UNION ALL SELECT 'Pedro Santos Teste',       '555.555.555-55','2016-03-22', 10,'M','(41) 99999-5555','Roberto Santos', 'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Bianca Rocha Teste',        '666.666.666-66','2019-05-08',  7,'F','(41) 99999-6666','Patrícia Rocha', 'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Lucas Martins Teste',       '777.777.777-77','2014-07-19', 12,'M','(41) 99999-7777','Ricardo Martins','Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Helena Costa Teste',        '888.888.888-88','2018-09-30',  8,'F','(41) 99999-8888','Juliana Costa',  'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Rafael Pereira Teste',      '999.999.999-99','2015-11-12', 11,'M','(41) 99999-9999','Márcia Pereira', 'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Laura Almeida Teste',       '101.101.101-10','2017-02-04',  9,'F','(41) 99999-1010','Gustavo Almeida','Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Gabriel Ferreira Teste',    '202.202.202-20','2016-04-14', 10,'M','(41) 99999-2020','Aline Ferreira', 'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Isabela Ribeiro Teste',     '303.303.303-30','2019-06-25',  7,'F','(41) 99999-3030','Eduardo Ribeiro','Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Matheus Carvalho Teste',    '404.404.404-40','2014-08-17', 12,'M','(41) 99999-4040','Camila Carvalho','Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Sofia Mendes Teste',        '505.505.505-50','2018-12-03',  8,'F','(41) 99999-5050','Bruno Mendes',   'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Guilherme Barbosa Teste',   '606.606.606-60','2015-01-28', 11,'M','(41) 99999-6060','Renata Barbosa', 'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Valentina Dias Teste',      '707.707.707-70','2017-03-16',  9,'F','(41) 99999-7070','Marcelo Dias',   'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Enzo Moreira Teste',        '808.808.808-80','2016-05-09', 10,'M','(41) 99999-8080','Daniela Moreira','Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Manuela Nunes Teste',       '909.909.909-90','2019-07-21',  7,'F','(41) 99999-9090','André Nunes',    'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Arthur Gomes Teste',        '121.121.121-12','2014-09-11', 12,'M','(41) 99999-1212','Paula Gomes',    'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Alice Teixeira Teste',      '131.131.131-13','2018-10-06',  8,'F','(41) 99999-1313','Felipe Teixeira','Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Miguel Correia Teste',      '141.141.141-14','2015-12-18', 11,'M','(41) 99999-1414','Priscila Correia','Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Lívia Castro Teste',        '151.151.151-15','2017-06-02',  9,'F','(41) 99999-1515','Rodrigo Castro', 'Paciente fictício adicional para testes.',TRUE
    UNION ALL SELECT 'Davi Araújo Teste',         '161.161.161-16','2016-11-23', 10,'M','(41) 99999-1616','Vanessa Araújo', 'Paciente fictício adicional para testes.',TRUE
) AS novos
WHERE NOT EXISTS (
    SELECT 1 FROM pacientes p
    WHERE p.cpf = novos.cpf OR p.nome = novos.nome
);