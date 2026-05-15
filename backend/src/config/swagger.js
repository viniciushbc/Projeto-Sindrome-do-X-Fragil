const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Sistema de Triagem - Síndrome do X Frágil',
    version: '1.0.0',
    description:
      'Documentação inicial da API do sistema de triagem para apoio ao encaminhamento de pacientes para teste genético confirmatório.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Verificação de status da API',
    },
    {
      name: 'Auth',
      description: 'Autenticação de usuários',
    },
    {
      name: 'Pacientes',
      description: 'Gerenciamento de pacientes',
    },
    {
      name: 'Avaliações',
      description: 'Gerenciamento das avaliações clínicas',
    },
    {
      name: 'Relatórios',
      description: 'Consulta de relatórios do sistema',
    },
  ],
  components: {
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id_usuario: {
            type: 'integer',
            example: 1,
          },
          nome: {
            type: 'string',
            example: 'Usuário Teste',
          },
          email: {
            type: 'string',
            example: 'usuario@teste.com',
          },
          perfil: {
            type: 'string',
            example: 'admin',
            enum: ['admin', 'profissional'],
          },
          ativo: {
            type: 'boolean',
            example: true,
          },
        },
      },

      Paciente: {
        type: 'object',
        properties: {
          id_paciente: {
            type: 'integer',
            example: 1,
          },
          nome: {
            type: 'string',
            example: 'Paciente Teste',
          },
          idade: {
            type: 'integer',
            example: 12,
          },
          sexo: {
            type: 'string',
            example: 'M',
            enum: ['M', 'F'],
          },
          responsavel: {
            type: 'string',
            example: 'Responsável Teste',
          },
          telefone: {
            type: 'string',
            example: '(41) 99999-9999',
          },
          observacoes: {
            type: 'string',
            example: 'Paciente para teste',
          },
        },
      },

      Sintoma: {
        type: 'object',
        properties: {
          id_sintoma: {
            type: 'integer',
            example: 1,
          },
          nome: {
            type: 'string',
            example: 'Deficiência intelectual',
          },
          descricao: {
            type: 'string',
            example: 'Indica presença de deficiência intelectual observada no paciente.',
          },
          ativo: {
            type: 'boolean',
            example: true,
          },
        },
      },

      Avaliacao: {
        type: 'object',
        properties: {
          id_avaliacao: {
            type: 'integer',
            example: 1,
          },
          id_paciente: {
            type: 'integer',
            example: 1,
          },
          id_usuario: {
            type: 'integer',
            example: 1,
          },
          score: {
            type: 'number',
            format: 'float',
            example: 0.72,
          },
          resultado: {
            type: 'string',
            example: 'Encaminhar para teste genético confirmatório',
          },
          data_avaliacao: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-14T18:00:00Z',
          },
        },
      },

      RespostaAvaliacao: {
        type: 'object',
        properties: {
          id_resposta: {
            type: 'integer',
            example: 1,
          },
          id_avaliacao: {
            type: 'integer',
            example: 1,
          },
          id_sintoma: {
            type: 'integer',
            example: 1,
          },
          presente: {
            type: 'boolean',
            example: true,
          },
        },
      },

      LoginRequest: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: {
            type: 'string',
            example: 'admin@teste.com',
          },
          senha: {
            type: 'string',
            example: '123456',
          },
        },
      },

      LoginResponse: {
        type: 'object',
        properties: {
          usuario: {
            $ref: '#/components/schemas/Usuario',
          },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificar status da API',
        description: 'Retorna uma mensagem simples informando que a API está em execução.',
        responses: {
          200: {
            description: 'API em execução',
            content: {
              'application/json': {
                example: {
                  status: 'ok',
                  message: 'API do Sistema de Triagem em execução',
                },
              },
            },
          },
          500: {
            description: 'Erro interno',
          },
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autenticar usuário',
        description: 'Realiza login do usuário e retorna os dados do usuário autenticado junto com o token JWT.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
          },
          401: {
            description: 'Não autenticado',
          },
          500: {
            description: 'Erro interno',
          },
        },
      },
    },

    '/pacientes': {
      get: {
        tags: ['Pacientes'],
        summary: 'Listar pacientes',
        description: 'Retorna a lista de pacientes cadastrados no sistema.',
        responses: {
          200: {
            description: 'Lista de pacientes retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Paciente',
                  },
                },
              },
            },
          },
          401: {
            description: 'Não autenticado',
          },
          500: {
            description: 'Erro interno',
          },
        },
      },

      post: {
        tags: ['Pacientes'],
        summary: 'Cadastrar paciente',
        description: 'Cria um novo paciente no sistema.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Paciente',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Paciente criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Paciente',
                },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
          },
          401: {
            description: 'Não autenticado',
          },
          500: {
            description: 'Erro interno',
          },
        },
      },
    },

    '/pacientes/{id}': {
      get: {
        tags: ['Pacientes'],
        summary: 'Buscar paciente por ID',
        description: 'Retorna os dados de um paciente específico.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do paciente',
            schema: {
              type: 'integer',
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Paciente encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Paciente',
                },
              },
            },
          },
          401: {
            description: 'Não autenticado',
          },
          404: {
            description: 'Registro não encontrado',
          },
          500: {
            description: 'Erro interno',
          },
        },
      },

      put: {
        tags: ['Pacientes'],
        summary: 'Atualizar paciente',
        description: 'Atualiza os dados de um paciente existente.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do paciente',
            schema: {
              type: 'integer',
              example: 1,
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Paciente',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Paciente atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Paciente',
                },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
          },
          401: {
            description: 'Não autenticado',
          },
          404: {
            description: 'Registro não encontrado',
          },
          500: {
            description: 'Erro interno',
          },
        },
      },
    },

    '/avaliacoes': {
      post: {
        tags: ['Avaliações'],
        summary: 'Criar avaliação clínica',
        description:
          'Registra uma avaliação clínica de um paciente, contendo as respostas dos sintomas e o score calculado.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                id_paciente: 1,
                respostas: [
                  {
                    id_sintoma: 1,
                    presente: true,
                  },
                  {
                    id_sintoma: 2,
                    presente: false,
                  },
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Avaliação criada com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Avaliacao',
                },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
          },
          401: {
            description: 'Não autenticado',
          },
          500: {
            description: 'Erro interno',
          },
        },
      },
    },

    '/avaliacoes/paciente/{idPaciente}': {
      get: {
        tags: ['Avaliações'],
        summary: 'Listar avaliações de um paciente',
        description: 'Retorna o histórico de avaliações clínicas de um paciente específico.',
        parameters: [
          {
            name: 'idPaciente',
            in: 'path',
            required: true,
            description: 'ID do paciente',
            schema: {
              type: 'integer',
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Avaliações retornadas com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Avaliacao',
                  },
                },
              },
            },
          },
          401: {
            description: 'Não autenticado',
          },
          404: {
            description: 'Registro não encontrado',
          },
          500: {
            description: 'Erro interno',
          },
        },
      },
    },

    '/relatorios': {
      get: {
        tags: ['Relatórios'],
        summary: 'Gerar relatório geral',
        description:
          'Retorna dados consolidados das avaliações, permitindo futuramente filtros por período, paciente, usuário e resultado.',
        parameters: [
          {
            name: 'dataInicio',
            in: 'query',
            required: false,
            description: 'Data inicial do filtro',
            schema: {
              type: 'string',
              format: 'date',
              example: '2026-01-01',
            },
          },
          {
            name: 'dataFim',
            in: 'query',
            required: false,
            description: 'Data final do filtro',
            schema: {
              type: 'string',
              format: 'date',
              example: '2026-12-31',
            },
          },
        ],
        responses: {
          200: {
            description: 'Relatório retornado com sucesso',
            content: {
              'application/json': {
                example: {
                  total_pacientes: 10,
                  total_avaliacoes: 15,
                  total_encaminhamentos: 6,
                },
              },
            },
          },
          401: {
            description: 'Não autenticado',
          },
          403: {
            description: 'Sem permissão',
          },
          500: {
            description: 'Erro interno',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;