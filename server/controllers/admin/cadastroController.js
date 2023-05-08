const Cliente = require('../../models/Cliente')
const Funcionario = require('../../models/Funcionario')
const Instrutor = require('../../models/Instrutores')
const Admin = require('../../models/Admin')
const moment = require('moment')
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
            dataNascimento: moment(req.body.dataNascimento, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            email: req.body.email,
            senha: req.body.senha,
            cpf: req.body.cpf,
            sexo: req.body.sexo,
            telefone: req.body.telefone,
            endereco: req.body.endereco,
        })


        let userCpf = req.body.cpf
        let userEmail = req.body.email

        let funcionario = await Funcionario.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let cliente = await Cliente.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let admin = await Admin.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let instrutor = await Instrutor.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })

        

        await req.flash('erro',`cpf ou email ja esta cadastrado no sistema`)
        await req.flash('sucesso',`Cadastro realizado com sucesso`)

        let erro = await req.consumeFlash('erro')
        let sucesso = await req.consumeFlash('sucesso')
        
        
        
        if(funcionario == null && instrutor == null && admin == null && cliente == null){
            try {

                await Cliente.create(novoCliente)

                console.log('Cadastro realizado');
                
                res.status(200).render('admin/cadastro/cliente', {sucesso})
            } catch (error) {
            console.log(error); 
            }
        }else{
            res.status(400).render('admin/cadastro/cliente', {erro})
            console.log(req.body);
            console.log('erro, usuario ja cadastrado');
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
            dataNascimento: moment(req.body.dataNascimento).format('DD/MM/YYYY'),
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

        let funcionario = await Funcionario.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let cliente = await Cliente.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let admin = await Admin.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let instrutor = await Instrutor.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })

        

        await req.flash('erro',`cpf ou email ja esta cadastrado no sistema`)
        await req.flash('sucesso',`Cadastro realizado com sucesso`)

        let erro = await req.consumeFlash('erro')
        let sucesso = await req.consumeFlash('sucesso')
        
        
        
        if(funcionario == null && instrutor == null && admin == null && cliente == null){
            try {

                await Funcionario.create(novoFuncionario)

                console.log('Cadastro realizado');
                
                res.status(200).render('admin/cadastro/funcionario', {sucesso})
            } catch (error) {
            console.log(error); 
            }
        }else{
            res.status(400).render('admin/cadastro/funcionario', {erro})
            console.log(req.body);
            console.log('erro, usuario ja cadastrado');
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
            dataNascimento: moment(req.body.dataNascimento).format('DD/MM/YYYY'),
            email: req.body.email,
            cpf: req.body.cpf,
            sexo: req.body.sexo,
            cargo: req.body.cargo,
            modalidade: req.body.modalidade,
            telefone: req.body.telefone,
            endereco: req.body.endereco,
        })


        let userCpf = req.body.cpf
        let userEmail = req.body.email

        let funcionario = await Funcionario.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let cliente = await Cliente.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let admin = await Admin.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })
        let instrutor = await Instrutor.findOne({
            $or: [
                {email: userEmail},
                {cpf: userCpf}
            ]
            
        })

        

        await req.flash('erro',`cpf ou email ja esta cadastrado no sistema`)
        await req.flash('sucesso',`Cadastro realizado com sucesso`)

        let erro = await req.consumeFlash('erro')
        let sucesso = await req.consumeFlash('sucesso')
        
        
        
        if(funcionario == null && instrutor == null && admin == null && cliente == null){
            try {

                await Instrutor.create(novoInstrutor)

                console.log('Cadastro realizado');
                
                res.status(200).render('admin/cadastro/instrutor', {sucesso})
            } catch (error) {
            console.log(error); 
            }
        }else{
            res.status(400).render('admin/cadastro/instrutor', {erro})
            console.log(req.body);
            console.log('erro, usuario ja cadastrado');
        }
    }


    