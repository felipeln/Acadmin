const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClienteSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String
    },
    dataNascimento: {
        type: String, // YYYY-MM-DD
        required: true
    },
    telefone: {
        type: String
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
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String,
    },
    status: {
        type: String,
        enum: ['Ativo', 'Inativo'],
        required: true,
        default: 'Ativo'
    },
    cpf: {
        type: String,
        required: true,
    },
    dataCadastro: {
        type: Date,
        default: Date.now()
    },

    dataModificado: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('Cliente', ClienteSchema)