const express = require('express');
const router = express.Router();
const {financeiro, pagamentos, searchCliente, searchClientePost,  historicoPagamentos, novaCobranca,novaCobrancaPost, boletoPago, boletoPagoPessoal, pagamentosSearch, excluirBoleto, financeiroAdicionar, financeiroRemover, excluirBoletoPessoal } = require('../controllers/admin/financeiroController')

const {relatorio,  relatorioFinanceiro, gerarRelatorioFinanceiro, relatorioFuncionario, gerarRelatorioFuncionarios, relatorioClientes, gerarRelatorioClientes } = require('../controllers/admin/relatorioController')
const dashboardController = require('../controllers/admin/dashboardController')
const GerenciamentoController = require('../controllers/admin/gerenciamentoController')
const cadastroController = require('../controllers/admin/cadastroController')
const { agendamento, agendamentoVer ,agendamentoCriar, agendamentoClienteSearch, agendamentoClienteSearchView , agendamentoClienteHistorico ,agendamentoEdit, agendamentoEditPut, agendamentoDelete, agendamentoSearch , instrutoresModalidade, instrutoresHorarios, novoAgendamento }  = require('../controllers/admin/agendamentoController')


//! dashboard admin

router.get('/dashboard/',  dashboardController.homepage)
router.post('/dashboard/cadastro/admin/', dashboardController.admin)

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

router.get('/dashboard/agendamento/criar/search', agendamentoClienteSearchView)
router.get('/dashboard/agendamento/historico/:id', agendamentoClienteHistorico)
router.post('/dashboard/agendamento/criar/search', agendamentoClienteSearch)

// ? novas rotas para agendamento
router.get('/dashboard/agendamento/criar/novo/:id', agendamentoCriar)
router.get('/dashboard/info/:modalidade', instrutoresModalidade)
router.get('/dashboard/info/:instrutor/horarios/:dia', instrutoresHorarios)
router.post('/dashboard/criar/novo-agendamento', novoAgendamento)


router.post('/dashboard/agendamento/search',  agendamentoSearch)


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
// ? financeiro geral
router.get('/dashboard/financeiro', financeiro)
router.post('/dashboard/financeiro/financas/adicionar', financeiroAdicionar)
router.delete('/dashboard/financeiro/financas/Remover/:id', financeiroRemover)
router.get('/dashboard/financeiro/geral', financeiro)
// ? pagamentos
router.get('/dashboard/financeiro/pagamentos', pagamentos)
router.post('/dashboard/financeiro/pagamentos/search', pagamentosSearch)
router.get('/dashboard/financeiro/criar/search', searchCliente)
router.post('/dashboard/financeiro/criar/search', searchClientePost)
router.get('/dashboard/financeiro/criar-novo/pagamento/:id', novaCobranca)
router.post('/dashboard/financeiro/criar-novo/pagamento/:id', novaCobrancaPost)
router.get('/dashboard/financeiro/pagamento/historico/:id', historicoPagamentos)

router.put('/dashboard/financeiro/pagar/boleto/:id', boletoPago)
router.delete('/dashboard/financeiro/excluir/boleto/:id', excluirBoleto)

router.put('/dashboard/financeiro/historico/boleto/pagar/:id', boletoPagoPessoal)
router.delete('/dashboard/financeiro/historico/boleto/excluir/:id', excluirBoletoPessoal)


//! dashboard admin relatorios
router.get('/dashboard/relatorios', relatorio)


router.get('/dashboard/relatorios/financeiro',relatorioFinanceiro)
router.post('/dashboard/gerar/relatorio/financeiro', gerarRelatorioFinanceiro)


router.get('/dashboard/relatorios/funcionarios', relatorioFuncionario)
router.post('/dashboard/gerar/relatorio/funcionarios', gerarRelatorioFuncionarios)

router.get('/dashboard/relatorios/clientes', relatorioClientes)
router.post('/dashboard/gerar/relatorio/clientes', gerarRelatorioClientes)


module.exports = router