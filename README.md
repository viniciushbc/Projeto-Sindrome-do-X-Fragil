# Sistema de Triagem para Síndrome do X Frágil

Projeto desenvolvido para a disciplina **Experiência Criativa: Criando Soluções Computacionais**.

O objetivo do sistema é auxiliar profissionais da saúde na triagem clínica de possíveis casos de **Síndrome do X Frágil**, por meio de um checklist de sintomas, cálculo automático de pontuação e geração de uma recomendação de encaminhamento para teste genético confirmatório.

O sistema não tem como objetivo realizar diagnóstico definitivo. Ele atua como uma ferramenta de apoio à decisão, organizando as informações clínicas do paciente e indicando quando a triagem sugere necessidade de investigação genética.

---

## Objetivo do projeto

Desenvolver uma aplicação web que permita:

- cadastrar usuários do sistema;
- diferenciar usuários administradores e usuários padrão;
- cadastrar e editar pacientes;
- preencher avaliações clínicas com sintomas relacionados à Síndrome do X Frágil;
- calcular automaticamente o score de triagem;
- comparar o score com o limiar definido para o sexo do paciente;
- exibir recomendação de encaminhamento ou não encaminhamento;
- armazenar histórico de avaliações;
- consultar relatórios por data, usuário, paciente e resultado;
- permitir impressão ou exportação do formulário de avaliação.

---

## Tecnologias escolhidas

### Front-end

- Angular
- TypeScript
- PrimeNG
- PrimeIcons
- SCSS

### Back-end

- Node.js
- Express
- Swagger / OpenAPI
- JWT para autenticação
- MySQL2 para conexão com banco

### Banco de dados

- MySQL

### Organização e versionamento

- GitHub
- ClickUp
- Matrix para comunicação com especialistas

### Visualização do quadro do projeto

Como o projeto foi organizado no **ClickUp** em vez do Trello, não foi possível compartilhar todo o quadro completo em uma única visualização pública no plano atual.

Para facilitar o acesso, criamos uma página com os links das visualizações públicas de cada sprint.

**Acesse aqui:**

[Visualizar quadro do projeto — Síndrome do X Frágil](https://viniciushbc.github.io/Projeto-Sindrome-do-X-Fragil/kanban.html)


---

## Estrutura planejada do projeto

```text
/
├── frontend/      # Aplicação Angular com PrimeNG
├── backend/       # API Node.js com Express
├── database/      # Scripts SQL, modelagem e seeds
├── docs/          # Documentações do projeto
├── README.md
├── .gitignore
└── .env.example
