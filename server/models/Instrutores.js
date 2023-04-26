const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const moment = require('moment'); 

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
        enum: ['Boxe', 'FitDance', 'Musculacao', 'Jiu Jitsu', 'Natacao', 'Pilates'],
        required: true,
    }
    ,
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


module.exports = mongoose.model('Instrutores', InstrutorSchema)



// InstrutorSchema.pre('save', async function(next) {
//     if(!this.isModified('senha')){
//         next()
//     }
//     this.senha = await bcrypt.hash(this.senha, 10)
// })
