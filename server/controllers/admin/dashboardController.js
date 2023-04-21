// model
const Cliente = require('../../models/Cliente')
const Funcionario = require('../../models/Funcionario')
const Instrutor = require('../../models/Instrutores')
const mongoose = require('mongoose')


// ! dashboard admin

exports.homepage = async (req,res) => {

    res.render('admin/dashboard')
}


//! dashboard agendamento
exports.agendamento = async (req,res) => {
    const data = {
        title: "agendamento"
    }
    res.render('admin/agendamento/agendamento', {data})
}


//! dashboard Financeiro
exports.financeiro = async (req,res) => {


    res.render('admin/financeiro/financeiro')
}


//! dashboard Relatorios
exports.relatorio = async (req,res) => {
 
    res.render('admin/relatorio/relatorios')

}

    exports.relatorioFinanceiro = async (req,res) => {

        res.render('admin/relatorio/relatorio_financeiro')

    }
    exports.relatorioFuncionario = async (req,res) => {

        res.render('admin/relatorio/relatorio_funcionarios')

    }
    exports.relatorioClientes = async (req,res) => {

        res.render('admin/relatorio/relatorio_clientes')

    }




