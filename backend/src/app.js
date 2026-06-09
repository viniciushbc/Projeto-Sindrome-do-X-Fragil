const express = require('express');
const cors = require('cors');

const healthRoute = require('./routes/health.routes');
const swaggerRoute = require('./routes/swagger.routes');
const authRoute = require('./routes/auth.routes');
const usuariosRoute = require('./routes/usuarios.routes');
const pacientesRoute = require('./routes/pacientes.routes');
const sintomasRoute = require('./routes/sintomas.routes');
const avaliacoesRoute = require('./routes/avaliacoes.routes');
const relatoriosRoute = require('./routes/relatorio.routes');
const logsRoute = require('./routes/logs.routes');
const agendamentosRoute = require('./routes/agendamentos.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRoute);
app.use('/swagger', swaggerRoute);
app.use('/auth', authRoute);
app.use('/usuarios', usuariosRoute);
app.use('/pacientes', pacientesRoute);
app.use('/sintomas', sintomasRoute);
app.use('/avaliacoes', avaliacoesRoute);
app.use('/relatorios', relatoriosRoute);
app.use('/logs', logsRoute);
app.use('/agendamentos', agendamentosRoute);

app.use((req, res) => {
  return res.status(404).json({ message: 'Rota não encontrada.', details: [] });
});

app.use((err, req, res, next) => {
  console.error('Erro Interno:', err);
  return res.status(500).json({ message: 'Erro interno no servidor.', details: [] });
});

module.exports = app;