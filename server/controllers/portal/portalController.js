// models


const mongoose = require('mongoose')


exports.home = async (req,res) =>{

    res.render('portal/portal')


}
exports.agendamento = async (req,res) =>{

    res.render('portal/user-agendamento')


}
exports.financeiro = async (req,res) =>{

    res.render('portal/user-financeiro')


}

