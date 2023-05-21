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
        req.session.userId = user.id
        return res.redirect('/portal');
      }
      
    }

    // Verificar se o usuário é um admin
    user = await Admin.findOne({ email: email });
    if (user) {
      const isMatched = await user.comparePassword(senha);
      if (isMatched) {
        req.session.cargo = 'Admin';
        req.session.userId = user.id
        return res.redirect('/dashboard');
      }
    }

    // Verificar se o usuário é um funcionário
    user = await Funcionario.findOne({ email: email });
    if (user) {
        if(user.status == 'Ativo'){
          const isMatched = await user.comparePassword(senha);
          if (isMatched) {
            req.session.cargo = 'funcionario';
            req.session.userId = user.id
            return res.redirect('/acadmin');
          }
      }else{
        await req.flash('erro',`Acesso do usuario bloqueado`)
        return res.status(400).redirect('/login');
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
