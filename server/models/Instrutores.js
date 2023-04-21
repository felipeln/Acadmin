const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InstrutorSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: String, // YYYY-MM-DD
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        default: null
    },
    sexo: {
        type: String,
        enum: ['Masculino','Feminino','Outro'],
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Ativo', 'Inativo'],
        required: true,
        default: 'Ativo'
    },
    cargo: {
        type: String,
        enum: ['Instrutor'],
        required: true,
        default: 'Instrutor'
    },
    modalidade:{
        type: String,
        enum: ['Boxe', 'FitDance', 'Musculacao', 'Jiu Jitsu', 'Natacao', 'Pilates' ],
        required: true,
    }
    ,
    cpf: {
        type: String,
        required: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now

    },
    dataModificado: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('Instrutores', InstrutorSchema)