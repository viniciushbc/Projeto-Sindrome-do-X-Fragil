require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./database/connection');

const PORT = process.env.PORT || 3000;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});