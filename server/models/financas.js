const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const moment = require('moment'); 

const financasSchema = new mongoose.Schema({
  desc: String,
  valor: Number,
  data: {
    type: String
  },
  tipo: String
});


module.exports = mongoose.model('financas', financasSchema)