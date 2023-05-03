const Cliente = require('../../models/Cliente')
const Boleto = require('../../models/boleto')
const mongoose = require('mongoose')
const moment = require('moment'); // require
const cron = require('node-cron');
moment.locale('pt-br');



exports.financeiro = async (req,res) =>{



    res.render('admin/financeiro/financeiro')
}



exports.pagamentos = async (req,res) => {
    try {
        const boletos = await Boleto.find()
        
      

        // let count = await Boleto.count()
        

        res.render('admin/financeiro/pagamentos', {
            boletos,
            // current: page,
            // number, 
            // pages: Math.ceil(count / perpage),
        })
    } catch (error) {
        console.log(error);
    }
}

exports.filtrarPagamento = async (req,res) =>{
    
}



exports.novaCobranca = async (req,res) =>{
  try {
    const cliente = await Cliente.findOne({ _id: req.params.id })
    let msgErro = await req.consumeFlash('AgendamentoMsg')
    let msgSucesso = await req.consumeFlash('AgendamentoMsgSucesso')

    const tipos = ['Mensalidade', 'Mensalidade com Atraso']
    
     
    res.render('admin/financeiro/criar-pagamento', {cliente, msgErro, msgSucesso, tipos})
  } catch (error) {
    console.log(error);
  }
}

exports.novaCobrancaPost = async (req,res) =>{
    try {
        const {valor, dataEmissao, dataVencimento, tipo} = req.body
        const cliente = await Cliente.findOne({ _id: req.params.id })


        const cobrança = new Boleto({
            clienteId: cliente._id,
            clienteNome: `${cliente.nome} ${cliente.sobrenome}`,
            valor: valor,
            tipo: tipo,
            dataEmissao: moment(dataEmissao).format('DD/MM/YYYY'),
            dataVencimento: moment(dataVencimento).format('DD/MM/YYYY'),
        })

        await cobrança.save()


        res.redirect('/dashboard/financeiro/pagamentos')
    } catch (error) {
        console.log(error);
    }
}

exports.searchCliente = async (req,res) =>{

   try {
    const clientesAcademia = await Cliente.aggregate([
        { $sort: { nome: 1 } }
        ]).exec();
        // console.log(clientesAcademia);

    res.render('admin/financeiro/pagamento-search-cliente', {clientesAcademia})
   } catch (error) {
    console.log(error);
   }
}

exports.searchClientePost = async (req,res) =>{
    try {
        let searchTerm = req.body.searchTerm
        const searcNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const clientesAcademia = await Cliente.find({
            $or: [
                {
                    nome: { $regex: new RegExp(searcNoSpecialChar, "i")}
                },
                
                {
                    sobrenome: { $regex: new RegExp(searcNoSpecialChar, "i")}
                },

            ]
        })

        res.render('admin/financeiro/pagamento-search-cliente', {clientesAcademia})
    
    } catch (error) {
        console.log(error);
    }
}



exports.historicoPagamentos = async (req,res) =>{
    // const cliente = await Cliente.findOne({ _id: req.params.id })
    const Id = req.params.id


    const boletos = await Boleto.find({clienteId: Id})
    console.log(boletos);
    
    
    res.render('admin/financeiro/historico', {boletos} )
}



exports.boletoPago = async (req,res) =>{

    try {
        const boleto = await Boleto.findByIdAndUpdate(req.params.id, {
            status: 'Pago',
            // dataPagamento: moment().format('DD/MM/YYYY ')
        })

        const previousUrl = req.get('referer') 
        

        // res.redirect(`/dashboard/financeiro/pagamento/historico/${boleto.clienteId}`)
        res.redirect(previousUrl)
    } catch (error) {
        console.log(error);
    }

}


exports.excluirBoleto =  async (req,res) =>{

    try {
        const boleto = await Boleto.findByIdAndRemove(req.params.id)

        console.log(boleto);

        res.redirect(`/dashboard/financeiro/pagamento/historico/${boleto.clienteId}`)
    } catch (error) {
        console.log(error);
    }

}