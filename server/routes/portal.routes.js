const express = require('express');
const router = express.Router();
const {home} = require('../controllers/portal/portalController')
const {agendamento, agendamentoVer,agendamentoCriar, agendamentoCriarPost, agendamentoEdit, agendamentoEditPut, agendamentoHistorico, instrutoresModalidade, instrutoresHorarios, agendamentoDelete} = require('../controllers/portal/agendamentoController')
const {financeiroPagamentos, boletoPago  } = require('../controllers/portal/financeiroController')

// ! portal 
// ? get
router.get('/portal', home)

// ! agendamento
// ? get pagina agendamento
router.get('/portal/agendamento', agendamento)
// ? get pagina VER
router.get('/portal/agendamento/ver/:id', agendamentoVer)
// ? get pagina EDIT
router.get('/portal/agendamento/edit/:id', agendamentoEdit)
// * post SALVAR EDIT
router.put('/portal/agendamento/edit/salvar/:id', agendamentoEditPut)
// * agendamento Delete
router.delete('/portal/agendamento/edit/:id', agendamentoDelete)
// ? get pagina HISTORICO
//! router.get('/portal/agendamento/historico/:id', agendamentoHistorico)
router.get('/portal/agendamento/historico/', agendamentoHistorico)
// ? get pagina CRIAR NOVO AGENDAMENTO
//! router.get('/portal/agendamento/criar/novo/:id', agendamentoCriar)
router.get('/portal/agendamento/criar/novo/', agendamentoCriar)
// * post Novo agendamento
router.post('/portal/agendamento/criando/novo', agendamentoCriarPost)

// ? get info Modalidade e seus instrutores
router.get('/portal/info/:modalidade', instrutoresModalidade)
// ? get info Instrutores horarios disponiveis  
router.get('/portal/info/:instrutor/horarios/:dia', instrutoresHorarios)

// !  Financeiro
// ? get
router.get('/portal/financeiro/', financeiroPagamentos)
// * pagar boleto/cobrança
router.put('/portal/financeiro/pagar/boleto/:id', boletoPago)


module.exports = router