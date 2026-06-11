# Banco de Dados — SIGMA (Síndrome do X Frágil)

## 1. Nome do banco

`sindrome_x_fragil`

## 2. Como criar o banco

### Pré-requisitos
- MySQL 8.0 ou superior

### Ordem de execução dos scripts

Execute sempre nesta ordem:

```bash
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

Nunca inverta a ordem. O `seed.sql` depende das tabelas criadas pelo `schema.sql`.

## 3. Como executar schema.sql

```bash
mysql -u root -p < database/schema.sql
```

Ou via MySQL Workbench: abra o arquivo e execute.

## 4. Como executar seed.sql

```bash
mysql -u root -p < database/seed.sql
```

## 5. Explicação das tabelas

### `usuarios`
Armazena todos os usuários do sistema. Dois tipos: `ADMIN` (acesso total) e `PADRAO` (acesso restrito aos próprios registros). Campos principais: nome, email, senha_hash, tipo_usuario, ativo.

### `pacientes`
Armazena os pacientes avaliados pelo sistema. O campo `sexo` é obrigatório (M ou F) pois determina os pesos usados no cálculo do score.

### `sintomas`
Lista dos sintomas clínicos do checklist. Cada sintoma possui um nome e pode ser ativado/desativado.

### `pesos_sintomas`
Armazena o peso de cada sintoma por sexo. O campo `aplicavel` indica se o sintoma se aplica ao sexo (macroorquidismo, por exemplo, não se aplica ao sexo feminino). Os pesos somados formam o score da triagem.

### `limiares`
Define o valor de corte para decisão de encaminhamento. Um por sexo:
- Masculino: 0.56
- Feminino: 0.55

### `avaliacoes`
Registra cada triagem clínica realizada. Campos: paciente, usuário responsável, data, dados do respondente, score calculado, limiar utilizado, resultado (`ENCAMINHAR` ou `NAO_ENCAMINHAR`) e observações.

### `respostas_avaliacao`
Armazena as respostas individuais do checklist de cada avaliação — um registro por sintoma respondido, com campo `presente` (boolean).

### `logs_auditoria`
Registra ações relevantes feitas pelos usuários (criação, edição, exclusão de registros). Só administradores podem consultar logs.

## 6. Relacionamentos

- `pesos_sintomas` → `sintomas` (FK: id_sintoma)
- `avaliacoes` → `pacientes` (FK: id_paciente)
- `avaliacoes` → `usuarios` (FK: id_usuario)
- `respostas_avaliacao` → `avaliacoes` (FK: id_avaliacao)
- `respostas_avaliacao` → `sintomas` (FK: id_sintoma)
- `logs_auditoria` → `usuarios` (FK: id_usuario, nullable)

## 7. Sintomas e pesos

| Sintoma | Peso Masc | Peso Fem | Aplicável F |
|---|---|---|---|
| Deficiência intelectual | 0.32 | 0.20 | ✓ |
| Face alongada ou orelhas de abano | 0.29 | 0.09 | ✓ |
| Macroorquidismo | 0.26 | — | ✗ |
| Hipermobilidade articular | 0.19 | 0.04 | ✓ |
| Dificuldades de aprendizagem | 0.18 | 0.28 | ✓ |
| Déficit de atenção | 0.17 | 0.12 | ✓ |
| Movimentos repetitivos | 0.17 | 0.05 | ✓ |
| Atraso na fala | 0.14 | 0.01 | ✓ |
| Hiperatividade | 0.12 | 0.04 | ✓ |
| Evita contato visual | 0.06 | 0.08 | ✓ |
| Evita contato físico | 0.04 | 0.07 | ✓ |
| Agressividade | 0.01 | 0.02 | ✓ |

## 8. Limiares

| Sexo | Valor |
|---|---|
| Masculino (M) | 0.56 |
| Feminino (F) | 0.55 |

## 9. Cálculo do score

```
Score = Σ (peso_sintoma × presente)
```

Onde `presente` = 1 se o sintoma foi marcado como presente, 0 caso contrário.

Se `Score >= limiar` → `ENCAMINHAR`  
Se `Score < limiar` → `NAO_ENCAMINHAR`

## 10. Usuários de teste

| Tipo | Email | Senha |
|---|---|---|
| ADMIN | admin@sistemaxfragil.com | Admin@123 |
| PADRAO | usuario@sistemaxfragil.com | Usuario@123 |

## 11. Consultas úteis

Veja o arquivo `queries_relatorios.sql` para consultas prontas de relatório, validação e auditoria.