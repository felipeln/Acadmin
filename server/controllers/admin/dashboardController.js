const Admin = require('../../models/Admin')


// model


// ! dashboard admin

exports.homepage = async (req,res) => {

    res.render('admin/dashboard')
}
exports.admin = async (req,res) => {

    const novoAdmin = new Admin({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            senha: req.body.senha,
    })

    try {

        await Admin.create(novoAdmin)

        console.log('Cadastro realizado');
        
        res.status(200).json({
            sucess: true,
            message: "Administrador cadastrado com sucesso",
            novoAdmin,
        })
    } catch (error) {
    console.log(error); 
    }

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




