const Cliente = require('../../models/Cliente')
const Admin = require('../../models/Admin')
const Funcionario = require('../../models/Funcionario')


exports.login = async (req,res) =>{

  let msg = await req.consumeFlash('erro')
  res.render('login/login', {msg})

}



exports.loginPost = async (req, res) => {
  try {
    
    const { email, senha } = req.body;

    // Verificar se o usuário é um cliente
    let user = await Cliente.findOne({ email: email });
    if (user) {
      const isMatched = await user.comparePassword(senha);
      if (isMatched) {
        req.session.cargo = 'Cliente';
        return res.redirect('/portal');
      }
    }

    // Verificar se o usuário é um admin
    user = await Admin.findOne({ email: email });
    if (user) {
      const isMatched = await user.comparePassword(senha);
      if (isMatched) {
        req.session.cargo = 'Admin';
        return res.redirect('/dashboard');
      }
    }

    // Verificar se o usuário é um funcionário
    user = await Funcionario.findOne({ email: email });
    if (user) {
      const isMatched = await user.comparePassword(senha);
      if (isMatched) {
        req.session.cargo = 'funcionario';
        return res.redirect('/acadmin');
      }
    }

    // Usuário não encontrado ou credenciais inválidas
    if(!user){
      await req.flash('erro',`Credenciais invalidas`)
      return res.status(400).redirect('/login');
      
    }
    // return res.status(400).json({
    //   success: false,
    //   message: 'Credenciais inválidas',
    // });
  } catch (error) {
    await req.flash('erro',`Falha ao tentar efetuar login`)
    console.log(error);
    return res.status(400).redirect('/login');
  }
};

exports.logOut = async (req,res) =>{

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });

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



// ! historico

/* exports.loginPost = async (req,res) =>{


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
*/

// !
  
/* ! ROTA Antig ade autenticação */
 /* !exports.loginPost = async (req,res) =>{

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
      }else{


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

      }

    

      
      // await req.flash('sucesso',`Login efetuado,  bem vindo ${user.nome} ${user.sobrenome}`)
      // let msgLogin = await req.consumeFlash('sucesso')
      
      // return res.status(200).render('admin/dashboard', {msg: msgLogin })

    

    } catch (error) {


      console.log(error);
      return res.status(400).redirect('/login')

  }
    
  }

*/

/* rota nova */
/* exports.loginPost = async (req,res) =>{

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
        
        return res.status(404).render('login/login', {msg: ['email invalido']})
      }

      // verify password
      const isMatched = await user.comparePassword(senha)
      if(!isMatched){
        return res.status(422).render('login/login', {msg: ["Senha invlida"]})
      }else{


        switch (user.cargo) {
          case 'Admin':
            req.session.cargo = 'Admin';
            return res.redirect('/dashboard');
          
          case 'Cliente':
            req.session.cargo = 'Cliente';
            return res.redirect('/portal');
          
          case 'funcionario':
            req.session.cargo = 'funcionario';
            return res.redirect('/acadmin');
          
          default:
            return res.status(400).json({
              success: false,
              message: 'Usuário inválido',
            });
        }
        
        

      }

    } catch (error) {


      console.log(error);
      return res.status(400).redirect('/login')

  }

}
*/
