const Funcionario = require('../../models/Funcionario')
// HOME PÁGE

exports.home = async (req,res) =>{
    const user =  await Funcionario.findById(req.session.userId)
    res.render('atendente/acadmin', {user})

}









