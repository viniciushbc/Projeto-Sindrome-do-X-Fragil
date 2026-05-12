# Sistema de Triagem para Síndrome do X Frágil

Projeto desenvolvido para a disciplina **Experiência Criativa: Criando Soluções Computacionais**.

O objetivo do sistema é auxiliar profissionais da saúde na triagem clínica de possíveis casos de **Síndrome do X Frágil**, por meio de um checklist de sintomas, cálculo automático de pontuação e geração de uma recomendação de encaminhamento para teste genético confirmatório.

O sistema não tem como objetivo realizar diagnóstico definitivo. Ele atua como uma ferramenta de apoio à decisão, organizando as informações clínicas do paciente e indicando quando a triagem sugere necessidade de investigação genética.

---

## Objetivo do projeto

Desenvolver uma aplicação web que permita:

- Cadastrar usuários do sistema;
- Diferenciar usuários administradores e usuários padrão;
- Cadastrar e editar pacientes;
- Preencher avaliações clínicas com sintomas relacionados à Síndrome do X Frágil;
- Calcular automaticamente o score de triagem;
- Comparar o score com o limiar definido para o sexo do paciente;
- Exibir recomendação de encaminhamento ou não encaminhamento;
- Armazenar histórico de avaliações;
- Consultar relatórios por data, usuário, paciente e resultado;
- Permitir impressão ou exportação do formulário de avaliação.

---

## Tecnologias escolhidas

### Front-end

- ![angular]
- ![typescript]
- ![primeng]
- ![primeicons]
- ![scss]

### Back-end

- ![nodejs]
- ![express]
- ![swagger]
- ![jwt] para autenticação
- ![mysql2] para conexão com banco

### Banco de dados

- ![mysql]

### Organização e versionamento

- ![github]
- ![clickup]
- ![matrix] para comunicação com especialistas

---

## Estrutura planejada do projeto

```sh
/
├── frontend/      # Aplicação Angular com PrimeNG
├── backend/       # API Node.js com Express
├── database/      # Scripts SQL, modelagem e seeds
├── docs/          # Documentações do projeto
├── README.md
├── .gitignore
└── .env.example
```
[angular]: https://img.shields.io/badge/Angular-black?logo=angular&logoColor=%23e422a6
[express]: https://img.shields.io/badge/Express-%23404d59.svg?logo=express&logoColor=%2361DAFB
[swagger]: https://img.shields.io/badge/Swagger-%2383B93E?logo=swagger&logoColor=%23152F46
[jwt]: https://img.shields.io/badge/JWT-black?logo=JSON%20web%20tokens
[mysql]: https://img.shields.io/badge/MySQL-%23005D83?logo=mysql&logoColor=white
[mysql2]: https://img.shields.io/badge/MySQL2-%23005D83?logo=mysql&logoColor=white
[github]: https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white
[primeng]: https://img.shields.io/badge/PrimeNG-white?logo=primeng&logoColor=%23C40025
[primeicons]: https://img.shields.io/badge/Prime%20Icons-white?logo=primeng&logoColor=%23C40025
[scss]: https://img.shields.io/badge/SCSS-%23c86095?logo=sass&logoColor=white
[clickup]: https://img.shields.io/badge/Click%20Up-white?logo=clickup&logoColor=%23F17861
[typescript]: https://img.shields.io/badge/TypeScript-white?logo=typescript&logoColor=blue
[nodejs]: https://img.shields.io/badge/Node.js-242624?logo=node.js&logoColor=5eba4e
[matrix]: https://img.shields.io/badge/Matrix-black?logo=matrix&logoColor=white
