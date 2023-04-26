const Cliente = require('../../models/Cliente')
const Admin = require('../../models/Admin')
const Funcionario = require('../../models/Funcionario')

const mongoose = require('mongoose')



exports.login = async (req,res) =>{

  res.render('login/login')

}




// exports.loginPost = async (req,res) =>{

//   try {
    
//     const {email, senha} = req.body


//     if(!email || !senha){
//       return res.render('login/login', {msg})
//     }

//     const cliente = await Cliente.findOne(({email: email}))

//     // verify email

//     if(!cliente){
//       return res.status(400).json({
//         sucess: false,
//         message: 'Credenciais invaldias'
//       })
//     }

//     // verify password
//     const isMatched = await cliente.comparePassword(senha)
//     if(!isMatched){
//       return res.status(400).json({
//         sucess: false,
//         message: 'Credenciais invaldias'
//       })
//     }


//     res.status(200).json({
//       sucess: true,
//       cliente
//     })


//   } catch (error) {


//     console.log(error);
//     return res.status(400).json({
//       sucess: false,
//       message: 'login nao pode ser feito, verifique seu email e senha',
//       error
//   })

// }
  
// }


exports.loginPost = async (req,res) =>{



  try {
    
    let msg = await req.consumeFlash()
    
    const {email, senha} = req.body

    // veirificando se usuario ja existe
      let user = await Cliente.findOne(({email: email}))
      
      if (!user) {
        user = await Admin.findOne(({email: email}))
      }

      if (!user) {
        user = await Funcionario.findOne(({email: email}))
      }

    // verify email

    if(!user){
      // return res.status(400).json({
      //   sucess: '2',
      //   message: 'Credenciais invaldias'
      // })
    
      return res.status(404).render('login/login', {msg: ['email invalido']})
    }

    // verify password
    const isMatched = await user.comparePassword(senha)
    if(!isMatched){
      // return res.status(400).json({
      //   sucess: false,
      //   message: 'Credenciais invaldias'
      // })
    
      return res.status(422).render('login/login', {msg: ["Senha invlida"]})
    }

   

    switch (user.cargo) {
      case "Admin":
        return res.redirect(`/dashboard`)
        break;
    
      case "Cliente":
        return res.redirect(`/portal`)
        break;
    
      case "funcionario":
        return res.redirect(`/acadmin`)
        break;
    
      default:
        return res.status(400).json({
          success: false,
          message: "Usuario invalido",
        });
        break;
    }


    // await req.flash('sucesso',`Login efetuado,  bem vindo ${user.nome} ${user.sobrenome}`)
    // let msgLogin = await req.consumeFlash('sucesso')
    
    // return res.status(200).render('admin/dashboard', {msg: msgLogin })

   

  } catch (error) {


    console.log(error);
    return res.status(400).redirect('/login')

}
  
}












exports.esqueceuSenha = async (req,res) =>{
  res.render('login/esqueci_senha')


}
exports.esqueceuSenhaPost = async (req,res) =>{
  res.render('login/esqueci_senha')

}

exports.resetSenha = async (req,res) =>{
  res.render('login/reset_senha')


}