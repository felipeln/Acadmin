const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const moment = require('moment'); 

const AdminSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
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
    cargo: {
        type: String,
        enum: ['Admin'],
        required: true,
        default: 'Admin'
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


// encryypting password before saving
AdminSchema.pre('save', async function(next){
    if(!this.isModified('senha')){
        next()
    }
    this.senha = await bcrypt.hash(this.senha, 10)
})
// verificar senha
AdminSchema.methods.comparePassword = async function(yourPassword){
    return await bcrypt.compare(yourPassword, this.senha);
}


module.exports = mongoose.model('Admin', AdminSchema)