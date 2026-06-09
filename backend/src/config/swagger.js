const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Sistema de Triagem - Síndrome do X Frágil',
    version: '2.0.0',
    description:
      'Documentação completa da API do sistema SIGMA para triagem e encaminhamento de pacientes para teste genético confirmatório da Síndrome do X Frágil.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
  tags: [
    { name: 'Health', description: 'Status da API' },
    { name: 'Auth', description: 'Autenticação' },
    { name: 'Usuários', description: 'Gerenciamento de usuários (ADMIN)' },
    { name: 'Pacientes', description: 'Gerenciamento de pacientes' },
    { name: 'Sintomas', description: 'Listagem de sintomas' },
    { name: 'Avaliações', description: 'Avaliações clínicas e histórico' },
    { name: 'Relatórios', description: 'Relatórios e consultas filtradas' },
    { name: 'Logs', description: 'Logs de auditoria (ADMIN)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ErroResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Mensagem de erro.' },
          details: { type: 'array', items: { type: 'string' }, example: [] },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['login', 'senha'],
        properties: {
          login: { type: 'string', description: 'E-mail ou CPF', example: 'admin@sigma.com' },
          senha: { type: 'string', example: 'Admin@123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          usuario: { $ref: '#/components/schemas/UsuarioResponse' },
        },
      },
      UsuarioCreate: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'tipo_usuario'],
        properties: {
          nome: { type: 'string', example: 'Dr. João Silva' },
          email: { type: 'string', example: 'joao@sigma.com' },
          cpf: { type: 'string', example: '000.000.000-00' },
          senha: { type: 'string', example: 'Senha@123' },
          tipo_usuario: { type: 'string', enum: ['ADMIN', 'PADRAO'], example: 'PADRAO' },
          crm: { type: 'string', example: '12345-PR' },
          especialidade: { type: 'string', example: 'Pediatria' },
          instituicao: { type: 'string', example: 'PUCPR' },
          cargo: { type: 'string', example: 'Médico' },
        },
      },
      UsuarioResponse: {
        type: 'object',
        properties: {
          id_usuario: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Dr. João Silva' },
          email: { type: 'string', example: 'joao@sigma.com' },
          tipo_usuario: { type: 'string', enum: ['ADMIN', 'PADRAO'], example: 'PADRAO' },
          crm: { type: 'string', example: '12345-PR' },
          especialidade: { type: 'string', example: 'Pediatria' },
          ativo: { type: 'boolean', example: true },
        },
      },
      PacienteCreate: {
        type: 'object',
        required: ['nome', 'sexo'],
        properties: {
          nome: { type: 'string', example: 'Paciente Teste' },
          cpf: { type: 'string', example: '000.000.000-00' },
          data_nascimento: { type: 'string', format: 'date', example: '2015-06-01' },
          idade: { type: 'integer', example: 10 },
          sexo: { type: 'string', enum: ['M', 'F'], example: 'M' },
          telefone: { type: 'string', example: '(41) 99999-9999' },
          responsavel: { type: 'string', example: 'Maria Silva' },
          observacoes: { type: 'string', example: 'Encaminhado pelo posto de saúde.' },
        },
      },
      PacienteResponse: {
        type: 'object',
        properties: {
          id_paciente: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Paciente Teste' },
          sexo: { type: 'string', enum: ['M', 'F'], example: 'M' },
          idade: { type: 'integer', example: 10 },
          responsavel: { type: 'string', example: 'Maria Silva' },
          telefone: { type: 'string', example: '(41) 99999-9999' },
          ativo: { type: 'boolean', example: true },
        },
      },
      SintomaResponse: {
        type: 'object',
        properties: {
          id_sintoma: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Deficiência intelectual' },
          descricao: { type: 'string', example: 'Presença de deficiência intelectual observada.' },
          ativo: { type: 'boolean', example: true },
        },
      },
      CriarAvaliacaoRequest: {
        type: 'object',
        required: ['id_paciente', 'respostas'],
        properties: {
          id_paciente: { type: 'integer', example: 1 },
          respondente_nome: { type: 'string', example: 'Maria Silva' },
          respondente_parentesco: { type: 'string', example: 'Mãe' },
          respondente_documento: { type: 'string', example: '000.000.000-00' },
          observacoes: { type: 'string', example: 'Paciente colaborativo.' },
          respostas: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id_sintoma', 'presente'],
              properties: {
                id_sintoma: { type: 'integer', example: 1 },
                presente: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
      CriarAvaliacaoResponse: {
        type: 'object',
        properties: {
          id_avaliacao: { type: 'integer', example: 1 },
          id_paciente: { type: 'integer', example: 1 },
          score: { type: 'number', example: 0.78 },
          limiar_utilizado: { type: 'number', example: 0.56 },
          resultado: { type: 'string', enum: ['ENCAMINHAR', 'NAO_ENCAMINHAR'], example: 'ENCAMINHAR' },
          recomendacao: { type: 'string', example: 'Encaminhar para teste genético confirmatório.' },
        },
      },
      AvaliacaoResumoResponse: {
        type: 'object',
        properties: {
          id_avaliacao: { type: 'integer', example: 1 },
          data_avaliacao: { type: 'string', format: 'date-time', example: '2026-05-10T10:00:00' },
          score: { type: 'number', example: 0.74 },
          limiar_utilizado: { type: 'number', example: 0.56 },
          resultado: { type: 'string', enum: ['ENCAMINHAR', 'NAO_ENCAMINHAR'], example: 'ENCAMINHAR' },
          paciente: {
            type: 'object',
            properties: {
              id_paciente: { type: 'integer', example: 1 },
              nome: { type: 'string', example: 'Paciente Teste' },
              sexo: { type: 'string', example: 'M' },
            },
          },
          profissional: {
            type: 'object',
            properties: {
              id_usuario: { type: 'integer', example: 2 },
              nome: { type: 'string', example: 'Profissional Teste' },
            },
          },
        },
      },
      AvaliacaoDetalheResponse: {
        type: 'object',
        properties: {
          id_avaliacao: { type: 'integer', example: 1 },
          data_avaliacao: { type: 'string', format: 'date-time', example: '2026-05-10T10:00:00' },
          score: { type: 'number', example: 0.74 },
          limiar_utilizado: { type: 'number', example: 0.56 },
          resultado: { type: 'string', enum: ['ENCAMINHAR', 'NAO_ENCAMINHAR'], example: 'ENCAMINHAR' },
          recomendacao: { type: 'string', example: 'Encaminhar para teste genético confirmatório.' },
          observacoes: { type: 'string', example: 'Avaliação de teste.' },
          respondente: {
            type: 'object',
            properties: {
              nome: { type: 'string', example: 'Maria Silva' },
              parentesco: { type: 'string', example: 'Mãe' },
              documento: { type: 'string', example: '000.000.000-00' },
            },
          },
          paciente: {
            type: 'object',
            properties: {
              id_paciente: { type: 'integer', example: 1 },
              nome: { type: 'string', example: 'Paciente Teste' },
              sexo: { type: 'string', example: 'M' },
            },
          },
          profissional: {
            type: 'object',
            properties: {
              id_usuario: { type: 'integer', example: 2 },
              nome: { type: 'string', example: 'Profissional Teste' },
            },
          },
          respostas: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id_sintoma: { type: 'integer', example: 1 },
                nome: { type: 'string', example: 'Deficiência intelectual' },
                presente: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
      RelatorioAvaliacaoResponse: {
        type: 'object',
        properties: {
          id_avaliacao: { type: 'integer', example: 1 },
          data_avaliacao: { type: 'string', format: 'date-time', example: '2026-05-10T10:00:00' },
          paciente: {
            type: 'object',
            properties: {
              id_paciente: { type: 'integer', example: 1 },
              nome: { type: 'string', example: 'Paciente Teste' },
              sexo: { type: 'string', example: 'M' },
            },
          },
          profissional: {
            type: 'object',
            properties: {
              id_usuario: { type: 'integer', example: 2 },
              nome: { type: 'string', example: 'Profissional Teste' },
            },
          },
          score: { type: 'number', example: 0.74 },
          limiar_utilizado: { type: 'number', example: 0.56 },
          resultado: { type: 'string', enum: ['ENCAMINHAR', 'NAO_ENCAMINHAR'], example: 'ENCAMINHAR' },
        },
      },
      LogSistemaResponse: {
        type: 'object',
        properties: {
          id_log: { type: 'integer', example: 1 },
          usuario: {
            type: 'object',
            properties: {
              id_usuario: { type: 'integer', example: 2 },
              nome: { type: 'string', example: 'Profissional Teste' },
            },
          },
          entidade: { type: 'string', enum: ['USUARIO', 'PACIENTE', 'AVALIACAO'], example: 'PACIENTE' },
          id_registro: { type: 'integer', example: 5 },
          acao: { type: 'string', enum: ['CRIACAO', 'EDICAO', 'EXCLUSAO', 'DESATIVACAO'], example: 'EDICAO' },
          campo_alterado: { type: 'string', example: 'telefone' },
          valor_anterior: { type: 'string', example: '(41) 99999-0000' },
          valor_novo: { type: 'string', example: '(41) 98888-1111' },
          data_hora: { type: 'string', format: 'date-time', example: '2026-05-10T12:30:00' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificar status da API',
        responses: {
          200: {
            description: 'API em execução',
            content: { 'application/json': { example: { status: 'ok', message: 'API em execução' } } },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autenticar usuário',
        description: 'Login com e-mail ou CPF e senha. Retorna token JWT.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: { description: 'Login OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          401: { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          403: { description: 'Usuário inativo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
        },
      },
    },
    '/usuarios': {
      get: {
        tags: ['Usuários'], summary: 'Listar usuários (ADMIN)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de usuários', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UsuarioResponse' } } } } },
          401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão (não ADMIN)' }, 500: { description: 'Erro interno' },
        },
      },
      post: {
        tags: ['Usuários'], summary: 'Criar usuário (ADMIN)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioCreate' } } } },
        responses: {
          201: { description: 'Usuário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioResponse' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/usuarios/{id}': {
      get: {
        tags: ['Usuários'], summary: 'Buscar usuário por ID (ADMIN)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Usuário encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioResponse' } } } },
          401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' }, 404: { description: 'Não encontrado' }, 500: { description: 'Erro interno' },
        },
      },
      put: {
        tags: ['Usuários'], summary: 'Atualizar usuário (ADMIN)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioCreate' } } } },
        responses: {
          200: { description: 'Usuário atualizado' }, 400: { description: 'Dados inválidos' },
          401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' }, 404: { description: 'Não encontrado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/usuarios/{id}/status': {
      patch: {
        tags: ['Usuários'], summary: 'Ativar/desativar usuário (ADMIN)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: { required: true, content: { 'application/json': { example: { ativo: false } } } },
        responses: {
          200: { description: 'Status atualizado' }, 400: { description: 'Dados inválidos' },
          401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' }, 404: { description: 'Não encontrado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/pacientes': {
      get: {
        tags: ['Pacientes'], summary: 'Listar pacientes',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de pacientes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PacienteResponse' } } } } },
          401: { description: 'Não autenticado' }, 500: { description: 'Erro interno' },
        },
      },
      post: {
        tags: ['Pacientes'], summary: 'Cadastrar paciente',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PacienteCreate' } } } },
        responses: {
          201: { description: 'Paciente criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/PacienteResponse' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          401: { description: 'Não autenticado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/pacientes/{id}': {
      get: {
        tags: ['Pacientes'], summary: 'Buscar paciente por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Paciente encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/PacienteResponse' } } } },
          401: { description: 'Não autenticado' }, 404: { description: 'Não encontrado' }, 500: { description: 'Erro interno' },
        },
      },
      put: {
        tags: ['Pacientes'], summary: 'Atualizar paciente',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PacienteCreate' } } } },
        responses: {
          200: { description: 'Paciente atualizado' }, 400: { description: 'Dados inválidos' },
          401: { description: 'Não autenticado' }, 404: { description: 'Não encontrado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/pacientes/{id}/status': {
      patch: {
        tags: ['Pacientes'], summary: 'Ativar/desativar paciente',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: { required: true, content: { 'application/json': { example: { ativo: false } } } },
        responses: {
          200: { description: 'Status atualizado' }, 400: { description: 'Dados inválidos' },
          401: { description: 'Não autenticado' }, 404: { description: 'Não encontrado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/sintomas': {
      get: {
        tags: ['Sintomas'], summary: 'Listar sintomas ativos',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de sintomas', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/SintomaResponse' } } } } },
          401: { description: 'Não autenticado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/avaliacoes': {
      post: {
        tags: ['Avaliações'], summary: 'Criar avaliação clínica',
        description: 'Registra uma avaliação com score calculado automaticamente a partir dos pesos dos sintomas.',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CriarAvaliacaoRequest' } } } },
        responses: {
          201: { description: 'Avaliação criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/CriarAvaliacaoResponse' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          401: { description: 'Não autenticado' }, 404: { description: 'Paciente não encontrado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/avaliacoes/paciente/{idPaciente}': {
      get: {
        tags: ['Avaliações'], summary: 'Histórico de avaliações de um paciente',
        description: 'ADMIN vê todas. PADRAO vê apenas as próprias.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'idPaciente', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Avaliações do paciente', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/AvaliacaoResumoResponse' } } } } },
          401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' }, 404: { description: 'Paciente não encontrado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/avaliacoes/{id}': {
      get: {
        tags: ['Avaliações'], summary: 'Detalhe de uma avaliação',
        description: 'Retorna todos os dados da avaliação incluindo respostas. PADRAO só pode ver avaliações próprias.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: { description: 'Detalhe da avaliação', content: { 'application/json': { schema: { $ref: '#/components/schemas/AvaliacaoDetalheResponse' } } } },
          401: { description: 'Não autenticado' }, 403: { description: 'Sem permissão' }, 404: { description: 'Avaliação não encontrada' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/relatorios': {
      get: {
        tags: ['Relatórios'], summary: 'Relatório de avaliações com filtros',
        description: 'ADMIN pode filtrar por qualquer usuário. PADRAO vê apenas os próprios dados.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'dataInicio', in: 'query', schema: { type: 'string', format: 'date', example: '2026-05-01' } },
          { name: 'dataFim', in: 'query', schema: { type: 'string', format: 'date', example: '2026-05-31' } },
          { name: 'idPaciente', in: 'query', schema: { type: 'integer', example: 1 } },
          { name: 'idUsuario', in: 'query', description: 'Apenas ADMIN pode usar', schema: { type: 'integer', example: 2 } },
          { name: 'resultado', in: 'query', schema: { type: 'string', enum: ['ENCAMINHAR', 'NAO_ENCAMINHAR'] } },
        ],
        responses: {
          200: { description: 'Relatório retornado', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/RelatorioAvaliacaoResponse' } } } } },
          400: { description: 'Filtros inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          401: { description: 'Não autenticado' }, 500: { description: 'Erro interno' },
        },
      },
    },
    '/logs': {
      get: {
        tags: ['Logs'], summary: 'Listar logs de auditoria (ADMIN)',
        description: 'Retorna logs de todas as alterações do sistema. Acesso exclusivo para ADMIN.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'entidade', in: 'query', schema: { type: 'string', enum: ['USUARIO', 'PACIENTE', 'AVALIACAO'] } },
          { name: 'acao', in: 'query', schema: { type: 'string', enum: ['CRIACAO', 'EDICAO', 'EXCLUSAO', 'DESATIVACAO'] } },
          { name: 'idUsuario', in: 'query', schema: { type: 'integer', example: 2 } },
          { name: 'dataInicio', in: 'query', schema: { type: 'string', format: 'date', example: '2026-05-01' } },
          { name: 'dataFim', in: 'query', schema: { type: 'string', format: 'date', example: '2026-05-31' } },
        ],
        responses: {
          200: { description: 'Logs retornados', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/LogSistemaResponse' } } } } },
          401: { description: 'Não autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          403: { description: 'Sem permissão (não ADMIN)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
          500: { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErroResponse' } } } },
        },
      },
    },
  },
};

const options = { swaggerDefinition, apis: ['./src/routes/*.js'] };
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;