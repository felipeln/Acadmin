const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cliente = new Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatorio']
    },
    telefone: String,
    email: {
        type: String,
        required: [true, 'Email é obrigatorio']
    },
    senha: {
        type: String,
        default: null
    },
    foto: String,
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
    documento: {
        tipo: {
            type: String,
            enum: ['Pessoa fisica','Pessoa juridica'], // individual (cpf) | corporation (cnpj)
            required: true
        },
        numero: {
            type: String,
            required: true
        },
    },endereco: {
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


module.exports = mongoose.model('cliente', cliente)