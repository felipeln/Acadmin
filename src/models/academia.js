const mongoose = require('mongoose')
const Schema = mongoose.Schema

const academia = new Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatorio']
    },
    foto: String,
    capa: String,
    email: {
        type: String,
        required: [true, 'Email é obrigatorio']
    },
    senha: {
        type: String,
        default: null
    },
    telefone: String,
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String,
    },
    geo: {
        tipo: String,
        coordinates: Array,

    },
    contaBancaria: {
        titular: {
            type: String,
            required: true
        },
        cpfCnpj: {
            type: String,
            required: true
        },
        banco: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        agencia: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        },
        dv: {
            type: String,
            required: true
        },
    },
    recipientId:{
        type: String,
        required: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now

    }
})

academia.index({ geo: '2dsphere'})

module.exports = mongoose.model('academia', academia)