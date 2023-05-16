const Cliente = require('../../models/Cliente')
const Funcionario = require('../../models/Funcionario')
const Instrutor = require('../../models/Instrutores')
const Admin = require('../../models/Admin')
const moment = require('moment')

 // ! formatar data.

 function interpretarData(dataString, formatoRetorno = 'DD/MM/YYYY') {
    // Verifica se a data está no formato 'DD/MM/YYYY'
    const dataBR = moment(dataString, 'DD/MM/YYYY', true);
    if (dataBR.isValid()) {
      return dataBR.format(formatoRetorno);
    }
  
    // Verifica se a data está no formato 'YYYY-MM-DD'
    const dataISO = moment(dataString, 'YYYY-MM-DD', true);
    if (dataISO.isValid()) {
      return dataISO.format(formatoRetorno);
    }
  
    // Caso nenhum formato seja correspondido, retorna null ou lança um erro, dependendo do caso.
    return null;
  }
  
  

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

        const {nome, sobrenome, email,senha,cpf,sexo,telefone,endereco, dataNascimento} = req.body

        let dataNascimentoFormatada = interpretarData(dataNascimento)
        const novoCliente = new Cliente({
            nome: nome,
            sobrenome: sobrenome,
            dataNascimento: dataNascimentoFormatada,
            email: email,
            senha: senha,
            cpf: cpf,
            sexo: sexo,
            telefone: telefone,
            endereco: endereco,
        })


        let userCpf = cpf
        let userEmail = email

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
            res.status(400).render('admin/cadastro/cliente', {erro, nome,sobrenome,email,cpf,telefone,endereco, dataNascimento})
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
        
        const {nome,sobrenome,dataNascimento,email,senha,cpf,sexo,cargo,telefone,endereco} = req.body

        let dataNascimentoFormatada = interpretarData(dataNascimento)
        const novoFuncionario = new Funcionario({
            nome: nome,
            sobrenome: sobrenome,
            dataNascimento: dataNascimentoFormatada,
            email: email,
            senha: senha,
            cpf: cpf,
            sexo: sexo,
            cargo: cargo,
            telefone: telefone,
            endereco: endereco,
        })

        
        let userCpf = cpf
        let userEmail = email

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
            res.status(400).render('admin/cadastro/funcionario', {
                erro,  nome,sobrenome,dataNascimento,email,cpf,cargo,telefone,endereco
            })
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

        const {nome,sobrenome,dataNascimento,email,cpf,sexo,cargo,modalidade,telefone,endereco} = req.body

        let dataNascimentoFormatada = interpretarData(req.body.dataNascimento)
        const novoInstrutor = new Instrutor({
            nome: nome,
            sobrenome: sobrenome,
            dataNascimento: dataNascimentoFormatada,
            email: email,
            cpf: cpf,
            sexo: sexo,
            cargo: cargo,
            modalidade: modalidade,
            telefone: telefone,
            endereco: endereco,
        })


        let userCpf = cpf
        let userEmail = email

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
            res.status(400).render('admin/cadastro/instrutor', {erro,nome,sobrenome,dataNascimento,email,cpf,telefone,endereco })
            console.log(req.body);
            console.log('erro, usuario ja cadastrado');
        }
    }


    