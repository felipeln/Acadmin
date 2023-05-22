const Cliente = require('../../models/Cliente')
const Boleto = require('../../models/boleto')
const bcrypt = require('bcryptjs')
const moment = require('moment'); // require
moment.locale('pt-br');


// ! formatar data.

function interpretarData(dataString, formatoRetorno = 'DD/MM/YYYY') {
    // Verifica se a data está no formato 'DD/MM/YYYY'
    const dataBR = moment(dataString, 'DD/MM/YYYY', true);
    if (dataBR.isValid()) {
      return dataBR.format(formatoRetorno);
    }
  
    // Verifica se a data está no formato 'YYYY-MM-DD'
    const dataISO = moment(dataString, 'YYYY-MM-DD', true);
    if (dataISO.isValid()) {
      return dataISO.format(formatoRetorno);
    }
  
    // Caso nenhum formato seja correspondido, retorna null ou lança um erro, dependendo do caso.
    return null;
  }



exports.financeiroPagamentos = async (req,res) =>{

    // res.render('portal/financeiro/user-pagamentos')

    try {
        // ! id do usuario logado
        // ? usuario teste
        // let clienteTeste = await Cliente.findOne({cpf: '256.369.343-74'})
        let id = req.session.userId
        const boletos = await Boleto.find({clienteId: id}).sort({status: -1})

        boletos.sort((a, b) => {
            const dataA = moment(a.dataEmissao, 'DD/MM/YYYY');
            const dataB = moment(b.dataEmissao, 'DD/MM/YYYY');
          
            return dataA.diff(dataB);
          });
          
        res.render('portal/financeiro/user-pagamentos', {
            boletos,
        })
    } catch (error) {
        console.log(error);
    }

}

exports.boletoPago = async (req,res) =>{

    try {

        let id = req.params.id
        let dataPagamentoFormatada = interpretarData(moment())
        const boleto = await Boleto.findByIdAndUpdate(req.params.id, {
            status: 'Pago',
            transactionHash: bcrypt.hashSync(id, 10),
            dataPagamento: dataPagamentoFormatada
        })

       const cliente = await Cliente.findById(boleto.clienteId)


        
        cliente.status = 'Ativo'
        await cliente.save()
        // ! id do usuario logado
        res.redirect(`/portal/financeiro/`)
    } catch (error) {
        console.log(error);
    }

}