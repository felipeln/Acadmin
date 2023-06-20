const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const moment = require('moment'); 

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
        enum: ['funcionario'],
        required: true,
        default: 'funcionario'
    },
    cpf: {
        type: String,
        required: true,
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

FuncionarioSchema.pre('save', async function(next){
    if(!this.isModified('senha')){
        next()
    }
    this.senha = await bcrypt.hash(this.senha, 10)
})
// verificar senha
FuncionarioSchema.methods.comparePassword = async function(yourPassword){
    return await bcrypt.compare(yourPassword, this.senha);
}

module.exports = mongoose.model('Funcionario', FuncionarioSchema)