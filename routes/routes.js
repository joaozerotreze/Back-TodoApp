const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');

// Middleware de tratamento de erros assíncronos
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/post', asyncHandler(async (req, res) => {
  const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada
  });
  
  // Força a persistência dos dados
  await objetoTarefa.save();
  
  // Busca a tarefa recém-criada para garantir que está no banco
  const tarefaSalva = await modeloTarefa.findById(objetoTarefa._id);
  if (!tarefaSalva) {
    throw new Error('Erro ao salvar tarefa');
  }
  
  res.status(201).json(tarefaSalva);
}));

router.get('/getAll', asyncHandler(async (req, res) => {
  // Força a leitura direta do banco
  const resultados = await modeloTarefa.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec();
    
  console.log('Tarefas encontradas:', resultados.length);
  res.json(resultados);
}));

router.delete('/delete/:id', asyncHandler(async (req, res) => {
  const tarefa = await modeloTarefa.findByIdAndDelete(req.params.id);
  if (!tarefa) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }
  
  // Verifica se a tarefa foi realmente removida
  const tarefaRemovida = await modeloTarefa.findById(req.params.id);
  if (tarefaRemovida) {
    throw new Error('Erro ao remover tarefa');
  }
  
  res.json({ message: 'Tarefa removida com sucesso', id: req.params.id });
}));

router.patch('/update/:id', asyncHandler(async (req, res) => {
  const tarefa = await modeloTarefa.findByIdAndUpdate(
    req.params.id,
    req.body,
    { 
      new: true, 
      runValidators: true,
      context: 'query'
    }
  );
  
  if (!tarefa) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }
  
  // Verifica se a atualização foi persistida
  const tarefaAtualizada = await modeloTarefa.findById(req.params.id);
  if (!tarefaAtualizada) {
    throw new Error('Erro ao atualizar tarefa');
  }
  
  res.json(tarefaAtualizada);
}));

module.exports = router;

