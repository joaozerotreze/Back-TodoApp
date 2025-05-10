const mongoose = require('mongoose');

const schemaTarefa = new mongoose.Schema({
 descricao: {
 required: true,
 type: String
 },
 statusRealizada: {
 required: true,
 type: Boolean,
 default: false
 },
},
 {
 timestamps: true,
 versionKey: false,
 collection: 'tarefas'
 }
)

// Adiciona índices para melhorar a performance
schemaTarefa.index({ createdAt: -1 });

module.exports = mongoose.model('Tarefa', schemaTarefa)