const Admin = require('../../models/Admin')


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




