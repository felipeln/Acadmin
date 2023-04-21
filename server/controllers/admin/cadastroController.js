const Cliente = require('../../models/Cliente')
const Funcionario = require('../../models/Funcionario')
const Instrutor = require('../../models/Instrutores')
const mongoose = require('mongoose')

// ! dashboard cadastro
    // * cliente 
    exports.cadastroCliente = async (req,res) => {
        try {
            res.render('admin/cadastro/cliente'
            )
        } catch (error) {
        console.log(error); 
        }
    }
    exports.cadastroClientePost = async (req,res) => {

        const novoCliente = new Cliente({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            dataNascimento: req.body.dataNascimento,
            email: req.body.email,
            senha: req.body.senha,
            cpf: req.body.cpf,
            sexo: req.body.sexo,
            telefone: req.body.telefone,
            endereco: req.body.endereco,
        })


        let userCpf = req.body.cpf
        let userEmail = req.body.email

        let result = await Cliente.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        await req.flash('erro',`cpf ou email ja estao cadastrados no sistema`)

        let msg = await req.consumeFlash('erro')
        
        
        
        if(result == null){
            try {

                await Cliente.create(novoCliente)

                console.log(result);
                
                res.redirect('/dashboard/cadastro/cliente')
            } catch (error) {
            console.log(error); 
            }
        }else{
            res.render('admin/cadastro/cliente', {msg})
            console.log('erro');
        }

       
    }

    // * funcionario
    exports.cadastroFuncionario = async (req,res) => {
        try {
            res.render('admin/cadastro/funcionario')
        } catch (error) {
        console.log(error); 
        }
    }
    exports.cadastroFuncionarioPost = async (req,res) => {
        

        const novoFuncionario = new Funcionario({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            dataNascimento: req.body.dataNascimento,
            email: req.body.email,
            senha: req.body.senha,
            cpf: req.body.cpf,
            sexo: req.body.sexo,
            cargo: req.body.cargo,
            telefone: req.body.telefone,
            endereco: req.body.endereco,
        })


        let userCpf = req.body.cpf
        let userEmail = req.body.email

        let result = await Funcionario.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        await req.flash('erro',`cpf ou email ja estao cadastrados no sistema`)

        let msg = await req.consumeFlash('erro')
        
        
        
        if(result == null){
            try {

                await Funcionario.create(novoFuncionario)

                console.log(result);
                
                res.redirect('/dashboard/cadastro/funcionario')
            } catch (error) {
            console.log(error); 
            }
        }else{
            res.render('admin/cadastro/funcionario', {msg})
            console.log('erro');
        }

    }

    // * instrutor
    exports.cadastroInstrutor = async (req,res) => {

        try {
            res.render('admin/cadastro/instrutor')
        } catch (error) {
        console.log(error); 
        }
    }
    exports.cadastroInstrutorPost = async (req,res) => {
        
        const novoInstrutor = new Instrutor({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            dataNascimento: req.body.dataNascimento,
            email: req.body.email,
            senha: req.body.senha,
            cpf: req.body.cpf,
            sexo: req.body.sexo,
            cargo: req.body.cargo,
            modalidade: req.body.modalidade,
            telefone: req.body.telefone,
            endereco: req.body.endereco,
        })


        let userCpf = req.body.cpf
        let userEmail = req.body.email

        let result = await Instrutor.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        await req.flash('erro',`cpf ou email ja estao cadastrados no sistema`)

        let msg = await req.consumeFlash('erro')
        
        
        
        if(result == null){
            try {

                await Instrutor.create(novoInstrutor)

                console.log(result);
                
                res.redirect('/dashboard/cadastro/instrutor')
            } catch (error) {
            console.log(error); 
            }
        }else{
            res.render('admin/cadastro/instrutor', {msg})
            console.log('erro');
        }

    }