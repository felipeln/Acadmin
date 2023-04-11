const mongoose = require('mongoose')
const Schema = mongoose.Schema

const agendamento = new Schema({
    clienteId:{
        type: mongoose.Types.ObjectId,
        ref: 'cliente',
        required: true
    },
    academiaId: {
        type: mongoose.Types.ObjectId,
        ref: 'academia',
        required: true
    },
    funcionarioId:{
        type: mongoose.Types.ObjectId,
        ref: 'funcionario',
        required: true
    },
    servicoId:{
        type: mongoose.Types.ObjectId,
        ref: 'servicos',
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now

    }
})

module.exports = mongoose.model('agendamento', agendamento)