const mongoose = require('mongoose')
const Schema = mongoose.Schema

const horario = new Schema({
    academiaId: {
        type: mongoose.Types.ObjectId,
        ref: 'academia',
        required: true
    },
    aulas: [{
        type: mongoose.Types.ObjectId,
        ref: 'servicos',
        required: true
    }],
    funcionarios:[{
        type: mongoose.Types.ObjectId,
        ref: 'funcionario',
        required: true
    }],
    dias: {
        type: [Number],
        required: true
    },
    inicio:{
        type: Date,
        required: true
    },
    fim:{
        type: Date,
        required: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now

    }
})


module.exports = mongoose.model('horario', horario)