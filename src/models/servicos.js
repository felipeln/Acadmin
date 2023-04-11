const mongoose = require('mongoose')
const Schema = mongoose.Schema

const servicos = new Schema({
    academiaId:{
        type: mongoose.Types.ObjectId,
        ref: 'academia'
    },
    titulo: {
        type: String,
        required: true
    },
    
    duração: { 
        type: Number, // duração em minutos
        required: true
    },
    recorrencia: {
        type: Number, // periodo de refaçao do servidor em dias
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Ativo', 'Inativo', 'Excluido'],
        required: true,
        default: 'Ativo'
    },dataCadastro: {
        type: Date,
        default: Date.now

    }
})

module.exports = mongoose.model('servicos', servicos)