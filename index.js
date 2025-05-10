const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Configuração de CORS mais específica
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://joao-201692-trabalho.vercel.app");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

// Configuração do MongoDB
const mongoURL = process.env.MONGO_DB || 'mongodb+srv://joao201692:joao123@cluster0.5dho7.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('Conexão com MongoDB estabelecida com sucesso');
})
.catch((error) => {
  console.error('Erro ao conectar com MongoDB:', error);
  process.exit(1);
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
const routes = require('./routes/routes');
app.use('/api', routes);

// Garante que a conexão seja fechada corretamente quando o servidor for encerrado
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Conexão com MongoDB fechada');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao fechar conexão com MongoDB:', err);
    process.exit(1);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
