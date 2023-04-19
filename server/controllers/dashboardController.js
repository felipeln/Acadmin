// model
const Cliente = require('../models/Cliente')
const mongoose = require('mongoose')


// dashboard admin

exports.homepage = async (req,res) => {



    res.render('dashboard')
}


// dashboard cadastro
exports.cadastro = async (req,res) => {
    
    
    
    res.render('cadastro')
}

// dashboard agendamento
exports.agendamento = async (req,res) => {
    const data = {
        title: "agendamento"
    }
    res.render('agendamento', {data})
}




// dashboard admin gerenciamento
exports.gerenciamento = async (req,res) => {


    res.render('funcionarios')
}
    //  Clientes
    exports.gerenciamentoClientes = async (req,res) => {

        
    let perpage = 12;
    let page = req.query.page || 1;

        try {
            const clientesAcademia = await Cliente.aggregate([{$sort: {updateAt: -1} }])
            .skip(perpage * page - perpage)
            .limit(perpage)
            .exec()

            res.render('clientes', {clientesAcademia})

        } catch (error) {
            console.log(error);
        }

    }

    // Turmas
    exports.gerenciamentoTurmas = async (req,res) => {


        res.render('turmas')
    }
    // Instrutores
    exports.gerenciamentoInstrutores = async (req,res) => {


        res.render('instrutores')
    }
    // Agenda
    exports.gerenciamentoAgenda = async (req,res) => {


        res.render('agenda')
    }

    // ver
    exports.gerenciamentoClienteVer = async (req,res) => {

        try {
            const clienteAcademia = await Cliente.findOne({ _id: req.params.id })
        
        
            res.render('ver', {
              clienteAcademia
            })
        
          } catch (error) {
            console.log(error);
          }

    }

    // edit
    exports.gerenciamentoClienteEdit = async (req,res) => {

        try {
            const clienteAcademia = await Cliente.findOne({ _id: req.params.id })

            res.render('edit', {
              clienteAcademia
            })
        
          } catch (error) {
            console.log(error);
          }

    }
    // salvar edit
    exports.gerenciamentoClienteEditPost = async (req,res) => {

        try {
            const clienteAcademia = await Cliente.findByIdAndUpdate(req.params.id,{
                nome: req.body.nome,
                sobrenome: req.body.sobrenome,
                dataNascimento: req.body.dataNascimento,
                telefone: req.body.telefone,
                email: req.body.email,
                senha: req.body.senha,
                sexo: req.body.sexo,
                status: req.body.status,
                cpf: req.body.cpf,
                dataModificado: Date.now()
            })
            
            

            await res.redirect(`/dashboard/gerenciamento/clientes/edit/${req.params.id}`);
            console.log('redirected');

          } catch (error) {
            console.log(error);
          }

    }

    // delete 
    exports.gerenciamentoClienteDelete = async (req,res) => {
        try {

            await Cliente.findByIdAndDelete(req.params.id)
        
            // await req.flash('deleted',`${user.firstName} ${user.lastName} has been deleted from database`)

            res.redirect("/dashboard/gerenciamento/clientes")
          } catch (error) {
            console.log(error);
          }
    }
    

// dashboard Financeiro
exports.financeiro = async (req,res) => {


    res.render('financeiro')
}


// dashboard Relatorios
exports.relatorio = async (req,res) => {
 
    res.render('relatorios')

}

    exports.relatorioFinanceiro = async (req,res) => {

        res.render('relatorio_financeiro')

    }
    exports.relatorioFuncionario = async (req,res) => {

        res.render('relatorio_funcionarios')

    }
    exports.relatorioClientes = async (req,res) => {

        res.render('relatorio_clientes')

    }




