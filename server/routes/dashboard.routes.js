const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController')

// dashboard admin

router.get('/dashboard', dashboardController.homepage)

// dashboard cadastro
router.get('/dashboard/cadastro', dashboardController.cadastro)

// dashboard agendamento
router.get('/dashboard/agendamento', dashboardController.agendamento)


// dashboard admin gerenciamento
router.get('/dashboard/gerenciamento', dashboardController.gerenciamento)

router.get('/dashboard/gerenciamento/funcionarios', dashboardController.gerenciamento)


router.get('/dashboard/gerenciamento/clientes', dashboardController.gerenciamentoClientes)
// VER
router.get('/dashboard/gerenciamento/clientes/ver/:id', dashboardController.gerenciamentoClienteVer)
// EDIT
router.get('/dashboard/gerenciamento/clientes/edit/:id', dashboardController.gerenciamentoClienteEdit)
// Save edit
router.put('/dashboard/gerenciamento/clientes/edit/:id', dashboardController.gerenciamentoClienteEditPost)
// delete
router.delete('/dashboard/gerenciamento/clientes/edit/:id', dashboardController.gerenciamentoClienteDelete)


router.get('/dashboard/gerenciamento/turmas',dashboardController.gerenciamentoTurmas)

router.get('/dashboard/gerenciamento/instrutores', dashboardController.gerenciamentoInstrutores)


router.get('/dashboard/gerenciamento/agenda', dashboardController.gerenciamentoAgenda)



// dashboard admin financeiro
router.get('/dashboard/financeiro', dashboardController.financeiro)




// dashboard admin relatorios
router.get('/dashboard/relatorios', dashboardController.relatorio)

router.get('/dashboard/relatorios/financeiro',dashboardController.relatorioFinanceiro)


router.get('/dashboard/relatorios/funcionarios', dashboardController.relatorioFuncionario)

router.get('/dashboard/relatorios/clientes', dashboardController.relatorioClientes)



module.exports = router