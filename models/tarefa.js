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
 createdAt: {
 type: Date,
 default: Date.now
 },
 updatedAt: {
 type: Date,
 default: Date.now
 }
},
 {
 timestamps: true,
 versionKey: false,
 collection: 'tarefas'
 }
)

// Adiciona índices para melhorar a performance
schemaTarefa.index({ createdAt: -1, _id: -1 });

module.exports = mongoose.model('Tarefa', schemaTarefa)