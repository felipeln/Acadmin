const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment'); 

const agendamentoSchema = new Schema({
  clienteId: {type: Schema.Types.ObjectId, ref: 'Cliente'},
  clienteNome: {type: Schema.Types.String, ref: 'Cliente'},
  instrutorId: { type: Schema.Types.ObjectId, ref: 'Instrutor' },
  instrutorNome: { type: Schema.Types.String, ref: 'Instrutor' },
  modalidade: String,
  dia: String,
  horarioComeca: String,
  horarioTermina: String,
  status: {
    type: String,
    enum: ['Ativo', 'Inativo'],
    required: true,
    default: 'Ativo'
},
dataCadastro: {
  type: String,
  default: moment().format('DD/MM/YYYY HH:mm:ss')
},

dataModificado: {
  type: String,
  default: moment().format('DD/MM/YYYY HH:mm:ss')
}
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);