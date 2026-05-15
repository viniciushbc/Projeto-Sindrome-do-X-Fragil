# Documentação da Modelagem Física - Síndrome do X Frágil

## Tabelas e Estruturas

### 1. `usuarios`
Armazena os usuários do sistema (administradores e usuários padrão).
* **Relacionamentos:** 1:N com `avaliacoes`, 1:N com `logs_sistema`.
* **Campos Principais:** `id_usuario` (PK), `nome`, `email` (UNIQUE), `cpf` (UNIQUE), `senha_hash`, `tipo_usuario`.

### 2. `pacientes`
Armazena os dados básicos do paciente avaliado.
* **Relacionamentos:** 1:N com `avaliacoes`.
* **Campos Principais:** `id_paciente` (PK), `nome`, `cpf` (UNIQUE), `data_nascimento`, `sexo`.

### 3. `sintomas`
Armazena os 12 sintomas usados no checklist de triagem.
* **Relacionamentos:** 1:N com `pesos_sintomas`, 1:N com `respostas_avaliacao`.
* **Campos Principais:** `id_sintoma` (PK), `nome`, `ativo`.

### 4. `pesos_sintomas`
Armazena os pesos dos sintomas separados por sexo.
* **Relacionamentos:** N:1 com `sintomas`.
* **Regra de Negócio:** O sintoma "Macroorquidismo" possui peso apenas para o sexo masculino, não sendo aplicável ao sexo feminino (campo `aplicavel` = FALSE).

### 5. `limiares`
Armazena os limiares de decisão (score de corte) por sexo.
* **Campos Principais:** `id_limiar` (PK), `sexo` (UNIQUE), `valor`.
* **Valores Iniciais:** Masculino = 0.56 | Feminino = 0.55.

### 6. `avaliacoes`
Registra cada triagem feita para um paciente por um usuário logado.
* **Relacionamentos:** N:1 com `pacientes` e `usuarios`, 1:N com `respostas_avaliacao`.
* **Campos Principais:** `id_avaliacao` (PK), `id_paciente` (FK), `id_usuario` (FK), `score`, `resultado`.

### 7. `respostas_avaliacao`
Registra se cada sintoma estava presente ou ausente na avaliação específica.
* **Relacionamentos:** N:1 com `avaliacoes` e `sintomas`.
* **Campos Principais:** `id_resposta` (PK), `id_avaliacao` (FK), `id_sintoma` (FK), `presente` (BOOLEAN).

### 8. `logs_sistema`
Registra alterações importantes e auditoria do sistema (Criação, Edição, Exclusão).
* **Relacionamentos:** N:1 com `usuarios`.
* **Campos Principais:** `id_log` (PK), `id_usuario` (FK), `entidade`, `acao`, `valor_anterior`, `valor_novo`.