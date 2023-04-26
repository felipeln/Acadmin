// const Cliente = require('../models/Cliente')
// const Funcionario = require('../models/Funcionario')
// const Admin = require('../models/Admin')



// exports.ClienteAutenticado = async (req,res) =>{

// }
// exports.FuncionarioAutenticado = async (req,res) =>{

// }
// exports.AdminAutenticado = async (req,res) =>{

// }


// const authAdmin = (permissons) =>{
    
//     return (req,res,next) =>{
//         const userRole = req.body.cargo
//         if(permissons.includes(userRole)){
//             next()
//         }else{
//             return res.status(401).json("You dont have permission")
//         }
//     }
// }
// const authCliente = () =>{

// }
// const AuthFuncionario = () =>{

// }

// function checkRole(role) {
//     return (req, res, next) => {
//       if (req.user && req.user.role === role) {
//         next();
//       } else {
//         res.status(401).json({ message: 'Unauthorized' });
//         console.log(req.user);

//       }
//     };
//   }



function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}


  module.exports = {checkToken}
// module.exports = {authAdmin, authCliente, AuthFuncionario}