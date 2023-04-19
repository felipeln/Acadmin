const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portalController')


router.get('/portal', portalController.home)

router.get('/portal/agendamento', portalController.agendamento)

router.get('/portal/financeiro', portalController.financeiro)



module.exports = router