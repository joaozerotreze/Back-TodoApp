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
  const tarefaSalva = await objetoTarefa.save();
  res.status(201).json(tarefaSalva);
}));

router.get('/getAll', asyncHandler(async (req, res) => {
  const resultados = await modeloTarefa.find()
    .sort({ createdAt: -1 })
    .lean();
  res.json(resultados);
}));

router.delete('/delete/:id', asyncHandler(async (req, res) => {
  const tarefa = await modeloTarefa.findByIdAndDelete(req.params.id);
  if (!tarefa) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }
  res.json({ message: 'Tarefa removida com sucesso', id: req.params.id });
}));

router.patch('/update/:id', asyncHandler(async (req, res) => {
  const tarefa = await modeloTarefa.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!tarefa) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }
  res.json(tarefa);
}));

module.exports = router;

