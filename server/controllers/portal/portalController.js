// models


const mongoose = require('mongoose')


exports.home = async (req,res) =>{

    res.render('portal')


}
exports.agendamento = async (req,res) =>{

    res.render('user-agendamento')


}
exports.financeiro = async (req,res) =>{

    res.render('user-financeiro')


}

