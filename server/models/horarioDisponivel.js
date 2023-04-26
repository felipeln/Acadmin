
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment'); 


const horariosDisponiveisSchema = new Schema({
    instrutorId: { type: Schema.Types.ObjectId, ref: 'Instrutor' },
    data: { type: Date },
    horas:  [
        {
            hora: "09:00"
        },
        {
            hora: "10:00"
        },
        {
            hora: "11:00"
        },
        {
            hora: "12:00"
        },
        {
            hora: "14:00"
        },
        {
            hora: "15:00"
        },
        {
            hora: "16:00"
        },
        {
            hora: "17:00"
        },
        {
            hora: "18:00"
        },
        {
            hora: "19:00"
        },
        {
            hora: "20:00"
        },
    ]
  });
  
  const HorariosDisponiveis = mongoose.model('HorariosDisponiveis', horariosDisponiveisSchema);
  