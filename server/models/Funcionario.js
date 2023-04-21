const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FuncionarioSchema = new Schema({
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
        enum: ['Atendente','Gerente'],
        required: true,
        default: 'Atendente'
    },
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

module.exports = mongoose.model('Funcionario', FuncionarioSchema)