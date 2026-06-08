DROP DATABASE IF EXISTS sindrome_x_fragil;
CREATE DATABASE sindrome_x_fragil DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sindrome_x_fragil;

CREATE TABLE usuarios (
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
    data_atualizacao DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pacientes (
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
    ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sintomas (
    id_sintoma INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pesos_sintomas (
    id_peso INT AUTO_INCREMENT PRIMARY KEY,
    id_sintoma INT NOT NULL,
    sexo ENUM('M', 'F') NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    aplicavel BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_sintoma) REFERENCES sintomas(id_sintoma) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE limiares (
    id_limiar INT AUTO_INCREMENT PRIMARY KEY,
    sexo ENUM('M', 'F') NOT NULL UNIQUE,
    valor DECIMAL(5,2) NOT NULL,
    descricao VARCHAR(255) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE avaliacoes (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_usuario INT NOT NULL,
    data_avaliacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    respondente_nome VARCHAR(150) NULL,
    respondente_parentesco VARCHAR(100) NULL,
    respondente_documento VARCHAR(30) NULL,
    score DECIMAL(6,3) NULL,
    limiar_utilizado DECIMAL(5,2) NULL,
    resultado ENUM('ENCAMINHAR', 'NAO_ENCAMINHAR') NULL,
    observacoes TEXT NULL,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE respostas_avaliacao (
    id_resposta INT AUTO_INCREMENT PRIMARY KEY,
    id_avaliacao INT NOT NULL,
    id_sintoma INT NOT NULL,
    presente BOOLEAN NOT NULL,
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacoes(id_avaliacao) ON DELETE CASCADE,
    FOREIGN KEY (id_sintoma) REFERENCES sintomas(id_sintoma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE logs_sistema (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    entidade VARCHAR(100) NOT NULL,
    id_registro INT NOT NULL,
    acao ENUM('CRIACAO', 'EDICAO', 'EXCLUSAO') NOT NULL,
    campo_alterado VARCHAR(100) NULL,
    valor_anterior TEXT NULL,
    valor_novo TEXT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS agendamentos (
    id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente    INT NOT NULL,
    id_usuario     INT NOT NULL,
    data_agendamento DATE NOT NULL,
    horario        TIME NOT NULL,
    observacao     TEXT NULL,
    status         ENUM('AGENDADO', 'REALIZADO', 'CANCELADO') NOT NULL DEFAULT 'AGENDADO',
    data_criacao   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario)  REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;