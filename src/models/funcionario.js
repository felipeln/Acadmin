const mongoose = require('mongoose')
const Schema = mongoose.Schema

const funcionario = new Schema({
    nome: {
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
    foto: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: String, // YYYY-MM-DD
        required: true
    },
    sexo: {
        type: String,
        enum: ['M','F'],
        required: true
    },
    status: {
        type: String,
        enum: ['Ativo', 'Inativo'],
        required: true,
        default: 'Ativo'
    },
    telefone: {
        type: String,
        required: true
    },
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String,
    },
    dataCadastro: {
        type: Date,
        default: Date.now

    }
})

module.exports = mongoose.model('funcionario', funcionario)