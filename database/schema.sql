CREATE DATABASE IF NOT EXISTS sindrome_x_fragil;
use sindrome_x_fragil;
create table usuarios (
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(150) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
cpf VARCHAR(14) NULL UNIQUE,
senha_hash VARCHAR(255) NOT NULL,
tipo_usuario ENUM('ADMIN', 'PADRAO') NOT NULL DEFAULT 'PADRAO',
crm VARCHAR(30) NULL,
especialidade VARCHAR(100) NULL,
instituicao VARCHAR(150) NULL,
cargo VARCHAR(100) NULL,
ativo BOOLEAN NOT NULL DEFAULT TRUE,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
data_atualizacao DATETIME NULL);


create table pacientes (
id_paciente INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(150) NOT NULL,
cpf VARCHAR(14) NULL UNIQUE,
data_nascimento DATE NULL,
idade INT NULL,
sexo ENUM('M', 'F') NOT NULL,
telefone VARCHAR(20) NULL,
responsavel VARCHAR(150) NULL,
observacoes TEXT NULL,
data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
data_atualizacao DATETIME NULL,
ativo BOOLEAN NOT NULL DEFAULT TRUE);


create table sintomas (
id_sintoma INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(150) NOT NULL,
descricao TEXT NULL,
ativo BOOLEAN NOT NULL DEFAULT TRUE,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);

insert into sintomas (nome) values
('Deficiência intelectual'),
('Face alongada ou orelhas de abano'),
('Macroorquidismo'),
('Hipermobilidade articular'),
('Dificuldades de aprendizagem'),
('Déficit de atenção'),
('Movimentos repetitivos'),
('Atraso na fala'),
('Hiperatividade'),
('Evita contato visual'),
('Evita contato físico'),
('Agressividade');


create table pesos_sintomas (
id_peso INT AUTO_INCREMENT PRIMARY KEY,
id_sintoma INT NOT NULL,
sexo ENUM('M', 'F') NOT NULL,
peso DECIMAL(5,2) NOT NULL,
aplicavel BOOLEAN NOT NULL DEFAULT TRUE,
FOREIGN KEY (id_sintoma) REFERENCES sintomas(id_sintoma));


create table limiares (
id_limiar INT AUTO_INCREMENT PRIMARY KEY,
sexo ENUM('M', 'F') NOT NULL UNIQUE,
valor DECIMAL(5,2) NOT NULL,
descricao VARCHAR(255) NULL,
ativo BOOLEAN NOT NULL DEFAULT TRUE);

insert into limiares (sexo, valor, descricao) values
('M', 0.56, 'Limiar masculino para encaminhamento'),
('F', 0.55, 'Limiar feminino para encaminhamento');