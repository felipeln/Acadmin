const express = require('express');
const router = express.Router();
const {financeiro, pagamentos, searchCliente, searchClientePost,  historicoPagamentos, novaCobranca,novaCobrancaPost, boletoPago, excluirBoleto } = require('../controllers/admin/financeiroController')
const dashboardController = require('../controllers/admin/dashboardController')
const GerenciamentoController = require('../controllers/admin/gerenciamentoController')
const cadastroController = require('../controllers/admin/cadastroController')
const { agendamento, agendamentoVer ,agendamentoCriar, agendamentoClienteSearch, agendamentoClienteSearchView , agendamentoCriarPost, agendamentoCriarAgendamento,agendamentoEdit, agendamentoEditPut, agendamentoDelete, agendamentoSearch , instrutoresModalidade, instrutoresHorarios, novoAgendamento }  = require('../controllers/admin/agendamentoController')
//! dashboard admin

// router.get('/dashboard',  dashboardController.homepage)
router.get('/dashboard/',  dashboardController.homepage)
router.post('/dashboard', dashboardController.admin)

//! dashboard cadastro
//? get cliente
router.get('/dashboard/cadastro', cadastroController.cadastroCliente)
router.get('/dashboard/cadastro/cliente', cadastroController.cadastroCliente)
//? post cliente
router.post('/dashboard/cadastro/cliente', cadastroController.cadastroClientePost)

//? get funcionario
router.get('/dashboard/cadastro/funcionario', cadastroController.cadastroFuncionario)
//? post funcionario
router.post('/dashboard/cadastro/funcionario', cadastroController.cadastroFuncionarioPost)

//? get instrutor
router.get('/dashboard/cadastro/instrutor', cadastroController.cadastroInstrutor)
//? post instrutor
router.post('/dashboard/cadastro/instrutor', cadastroController.cadastroInstrutorPost)

// ! dashboard agendamento
router.get('/dashboard/agendamento', agendamento)
router.get('/dashboard/agendamento/ver/:id', agendamentoVer)
router.get('/dashboard/agendamento/edit/:id', agendamentoEdit)
router.put('/dashboard/agendamento/edit/:id', agendamentoEditPut)
router.delete('/dashboard/agendamento/edit/:id', agendamentoDelete)

// router.get('/dashboard/agendamento/criar', agendamentoCriar)
router.get('/dashboard/agendamento/criar/search', agendamentoClienteSearchView)
router.post('/dashboard/agendamento/criar/search', agendamentoClienteSearch)

// ? novas rotas para agendamento
router.get('/dashboard/agendamento/criar/novo/:id', agendamentoCriar)
router.get('/info/:modalidade', instrutoresModalidade)
router.get('/info/:instrutor/horarios/:dia', instrutoresHorarios)
router.post('/criar/novo-agendamento', novoAgendamento)


// router.get('/dashboard/agendamento/criar/modalidade', agendamentoCriarPost)
// router.post('/dashboard/agendamento/criar/modalidade', agendamentoCriarPost)
// router.post('/dashboard/agendamento/criar/modalidade/agendado', agendamentoCriarAgendamento)

router.post('/dashboard/agendamento/search',  agendamentoSearch)



// * turmas
// * horarios
// * agendamento


// ! dashboard admin  **gerenciamento**

// * Funcionarios
    router.get('/dashboard/gerenciamento', GerenciamentoController.funcionarios)

    router.get('/dashboard/gerenciamento/funcionarios', GerenciamentoController.funcionarios)

    //? VER
    router.get('/dashboard/gerenciamento/funcionarios/ver/:id', GerenciamentoController.FuncionarioVer)
    //? EDIT
    router.get('/dashboard/gerenciamento/funcionarios/edit/:id', GerenciamentoController.FuncionarioEdit)
    //? Save edit
    router.put('/dashboard/gerenciamento/funcionarios/edit/:id', GerenciamentoController.FuncionarioEditPost)
    //? delete
    router.delete('/dashboard/gerenciamento/funcionarios/edit/:id', GerenciamentoController.FuncionarioDelete)
    //? search
    router.post('/dashboard/gerenciamento/funcionarios/search', GerenciamentoController.FuncionarioSearch)


// * Clientes
    router.get('/dashboard/gerenciamento/clientes', GerenciamentoController.Clientes)
    //? VER
    router.get('/dashboard/gerenciamento/clientes/ver/:id', GerenciamentoController.ClienteVer)
    //? EDIT
    router.get('/dashboard/gerenciamento/clientes/edit/:id', GerenciamentoController.ClienteEdit)
    //? Save edit
    router.put('/dashboard/gerenciamento/clientes/edit/:id', GerenciamentoController.ClienteEditPost)
    //? delete
    router.delete('/dashboard/gerenciamento/clientes/edit/:id', GerenciamentoController.ClienteDelete)
    //? search
    router.post('/dashboard/gerenciamento/clientes/search', GerenciamentoController.ClienteSearch)


//  * Instrutores
    router.get('/dashboard/gerenciamento/instrutores', GerenciamentoController.Instrutores)
    //? ver
    router.get('/dashboard/gerenciamento/instrutores/ver/:id', GerenciamentoController.InstrutorVer)
    //? Edit
    router.get('/dashboard/gerenciamento/instrutores/edit/:id', GerenciamentoController.InstrutorEdit)
    //? Save Edit
    router.put('/dashboard/gerenciamento/instrutores/edit/:id', GerenciamentoController.InstrutorEditPost)
    //? Delete
    router.delete('/dashboard/gerenciamento/instrutores/edit/:id', GerenciamentoController.InstrutorDelete)
    //? search
    router.post('/dashboard/gerenciamento/instrutores/search', GerenciamentoController.InstrutorSearch)


//! dashboard admin financeiro
router.get('/dashboard/financeiro', financeiro)
router.get('/dashboard/financeiro/geral', financeiro)
router.get('/dashboard/financeiro/pagamentos', pagamentos)
router.get('/dashboard/financeiro/criar/search', searchCliente)
router.post('/dashboard/financeiro/criar/search', searchClientePost)
router.get('/dashboard/financeiro/criar-novo/pagamento/:id', novaCobranca)
router.post('/financeiro/criar-novo/pagamento/:id', novaCobrancaPost)
router.get('/dashboard/financeiro/pagamento/historico/:id', historicoPagamentos)

router.put('/financeiro/pagar/boleto/:id', boletoPago)
router.delete('/financeiro/excluir/boleto/:id', excluirBoleto)
// router.get('/dashboard/financeiro/criar-novo/pagamento/:id', criarPagamento)
// router.get('/dashboard/financeiro/criar-novo/pagamento/:id', novoPagamento)




//! dashboard admin relatorios
router.get('/dashboard/relatorios', dashboardController.relatorio)

router.get('/dashboard/relatorios/financeiro',dashboardController.relatorioFinanceiro)


router.get('/dashboard/relatorios/funcionarios', dashboardController.relatorioFuncionario)

router.get('/dashboard/relatorios/clientes', dashboardController.relatorioClientes)



module.exports = router