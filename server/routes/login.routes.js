const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login/loginController');



// login
router.get('/login',  loginController.login)
router.post('/login',  loginController.loginPost)
// logOut
router.post('/logout', loginController.logOut)
// esqueci a senha
router.get('/esqueci_a_senha',loginController.esqueceuSenha)
// rota para onde vai o email para resetar a senha
router.get('/reset_senha', loginController.resetSenha)


module.exports = router
