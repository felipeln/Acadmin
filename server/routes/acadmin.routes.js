const express = require('express');
const router = express.Router();
const { home}= require('../controllers/atendente/acadminController');
// ! cadastro
const {cadastro, cadastroClientePost} = require('../controllers/atendente/cadastroController')

// ! agendamento
const { 
    agendamento,agendamentoSearch ,agendamentoVer, agendamentoEdit, agendamentoEditPut, agendamentoDelete, agendamentoSearchCliente,agendamentoSearchClientePost ,agendamentoClienteHistorico, agendamentoCriar, agendamentoCriarPost, instrutoresModalidade, instrutoresHorarios
} = require('../controllers/atendente/agendamentoController')
// ! gerneciamento

const { 
    gerenciamentoCliente, gerenciamentoClienteVer, gerenciamentoClienteEdit, gerenciamentoClienteEditPost, gerenciamentoClienteDelete, gerenciamentoClienteSearch
} = require('../controllers/atendente/gerenciamentoController')
// ! financeiro
const { 
    financeiroPagamentos, pagamentosSearch, pagamentoSearchCliente, pagamentoSearchClientePost,
    pagamentoNovaCobranca, pagamentoNovaCobrancaPost, historicoPagamentos,  boletoPago, boletoPagoPessoal 
 } = require('../controllers/atendente/financeiroController')






//  ! Home

    router.get('/acadmin',home)

// ! cadastro
    // ? get cliente cadastro page
    router.get('/acadmin/cadastro',cadastro)
    router.get('/acadmin/cadastro/cliente',cadastro)
    // * post cliente
    router.post('/acadmin/cadastro/cliente', cadastroClientePost)


// ! agendamento
    // ? get agendamento page
    router.get('/acadmin/agendamento',agendamento)
    router.post('/acadmin/agendamento/search',agendamentoSearch)
    // ? agendamento ver page
    router.get('/acadmin/agendamento/ver/:id', agendamentoVer)
    // ? agendamento edit page
    router.get('/acadmin/agendamento/edit/:id', agendamentoEdit)
    // * agendamento Put
    router.put('/acadmin/agendamento/edit/salvar/:id', agendamentoEditPut)
    // * agendamento Delete
    router.delete('/acadmin/agendamento/edit/:id', agendamentoDelete)
    // ? get agendamento search cliente para novo agendamento
    router.get('/acadmin/agendamento/criar/search/cliente', agendamentoSearchCliente)
    // * agendamento search cliente post
    router.post('/acadmin/criar/search/cliente', agendamentoSearchClientePost)
    // ? get agendamento cliente Historico
    router.get('/acadmin/agendamento/historico/:id',agendamentoClienteHistorico)
    // ? get page criar novo agendamento
    router.get('/acadmin/agendamento/criar/novo/:id',agendamentoCriar)
    // * post para criar novo agendamento
    router.post('/acadmin/agendamento/criando/novo/',agendamentoCriarPost)
    // ? get info Modalidade e seus instrutores
    router.get('/acadmin/info/:modalidade', instrutoresModalidade)
    // ? get info Instrutores horarios disponiveis  
    router.get('/acadmin/info/:instrutor/horarios/:dia', instrutoresHorarios)

// ! gerneciamento
    // ? get page clientes
    router.get('/acadmin/gerenciamento',gerenciamentoCliente)
    router.get('/acadmin/gerenciamento/clientes', gerenciamentoCliente)
    //? VER
    router.get('/acadmin/gerenciamento/clientes/ver/:id', gerenciamentoClienteVer)
    //? EDIT
    router.get('/acadmin/gerenciamento/clientes/edit/:id', gerenciamentoClienteEdit)
    // * Save edit
    router.put('/acadmin/gerenciamento/clientes/edit/salvar/:id', gerenciamentoClienteEditPost)
    // * delete
    router.delete('/acadmin/gerenciamento/clientes/edit/:id', gerenciamentoClienteDelete)
    // * search
    router.post('/acadmin/gerenciamento/clientes/search', gerenciamentoClienteSearch)




// ! financeiro
    // ? get page pagamentos
    router.get('/acadmin/financeiro/pagamentos',financeiroPagamentos)
    // * pagamentos search
    router.post('/acadmin/financeiro/pagamentos/search', pagamentosSearch)
    // ? get pagamentos criar search cliente
    router.get('/acadmin/financeiro/criar/search', pagamentoSearchCliente)
    // * post search cliente
    router.post('/acadmin/financeiro/criar/search', pagamentoSearchClientePost)
    // ? get pagamento cria nova cobrança
    router.get('/acadmin/financeiro/criar-novo/pagamento/:id', pagamentoNovaCobranca)
    // * post criar nova cobrança
    router.post('/acadmin/financeiro/criar-novo/pagamento/:id', pagamentoNovaCobrancaPost)
    // ? get cliente historico de pagamentos
    router.get('/acadmin/financeiro/pagamento/historico/:id', historicoPagamentos)
    // * pagar boleto/cobrança
    router.put('/acadmin/financeiro/pagar/boleto/:id', boletoPago)
    // * excluir boleto/cobrança
    // ? router.delete('/financeiro/excluir/boleto/:id', excluirBoleto)

    // * pagar boleto/cobrança no historico do cliente
    router.put('/acadmin/financeiro/historico/boleto/pagar/:id', boletoPagoPessoal)
    // * excluir boleto/cobrança no historico do cliente
    // ? router.delete('/financeiro/historico/boleto/excluir/:id', excluirBoletoPessoal)


module.exports = router