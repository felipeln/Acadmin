const express = require('express');
const router = express.Router();
const acadminController = require('../controllers/acadminController');




router.get('/acadmin',acadminController.home)

router.get('/acadmin/cadastro',acadminController.cadastro)

router.get('/acadmin/agendamento',acadminController.agendamento)

router.get('/acadmin/financeiro',acadminController.financeiro)

router.get('/acadmin/gerenciamento',acadminController.gerenciamento)

module.exports = router