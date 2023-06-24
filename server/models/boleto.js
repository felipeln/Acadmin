const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const moment = require('moment'); 

const boletoSchema = new Schema({
    clienteId: {type: Schema.Types.ObjectId, ref: 'Cliente', required: true},
    clienteNome: {type: Schema.Types.String, ref: 'Cliente', required: true},
    clienteCpf: {type: Schema.Types.String, ref: 'Cliente', required: true},
    dataEmissao: {
      type: String,
      required: true
    },
    dataVencimento: {
      type: String,
      required: true
    },
    dataPagamento: {
      type: String,
      default: null
    },
    valor:{
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Pendente','Pago','Atrasado'],
      required: true,
      default: 'Pendente'
    },
    tipo:{
      type: String,
      required: true,
    },
    transactionHash:{
      type: String,
      default: ''
    }
})

module.exports = mongoose.model('Boleto', boletoSchema)