

const mongoose = require('mongoose')



exports.login = async (req,res) =>{
  res.render('login')

}
exports.esqueceuSenha = async (req,res) =>{
  res.render('esqueci_senha')


}

exports.resetSenha = async (req,res) =>{
  res.render('esqueci_senha')


}

