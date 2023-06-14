// models
const Cliente = require('../../models/Cliente')
exports.home = async (req,res) =>{
    const user =  await Cliente.findById(req.session.userId)
    res.render('portal/portal', {user})

}



