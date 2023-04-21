const mongoose = require('mongoose')


// HOME PÁGE

exports.home = async (req,res) =>{

    res.render('atendente/acadmin')

}

exports.cadastro = async (req,res) =>{

    res.render('atendente/cadastro')

}

exports.agendamento = async (req,res) =>{

    res.render('atendente/agendamento')

}

exports.financeiro = async (req,res) =>{

    res.render('atendente/financeiro')

}


exports.gerenciamento = async (req,res) =>{

    res.render('atendente/gerenciamento')

}





