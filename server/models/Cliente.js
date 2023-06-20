const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const moment = require('moment'); 

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
        type: String,
        required: true
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
    cargo: {
        type: String,
        enum: ['Cliente'],
        required: true,
        default: 'Cliente'
    },
    dataCadastro: {
        type: String,
        default: moment().format('DD/MM/YYYY HH:mm:ss')
    },

    dataModificado: {
        type: String,
        default: moment().format('DD/MM/YYYY HH:mm:ss')
    }
})

// salvar senha encryptada
ClienteSchema.pre('save', async function(next){
    if(!this.isModified('senha')){
        next()
    }
    this.senha = await bcrypt.hash(this.senha, 10)
})

// verificar senha
ClienteSchema.methods.comparePassword = async function(yourPassword){
    return await bcrypt.compare(yourPassword, this.senha);
}

module.exports = mongoose.model('Cliente', ClienteSchema)