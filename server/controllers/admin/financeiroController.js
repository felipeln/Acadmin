const Cliente = require('../../models/Cliente')
const Boleto = require('../../models/boleto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const moment = require('moment'); // require
const cron = require('node-cron');
const Agendamento = require('../../models/Agendamento');
const { agendamento } = require('./agendamentoController');
moment.locale('pt-br');

// mudar status para atrasado

cron.schedule('*/5 * * * * *', async () => {
    // console.log('Verificando boletos pendentes...');
  
    // Busca todos os boletos pendentes no banco de dados
    const boletos = await Boleto.find({ status: 'Pendente' });


    boletos.forEach(async (boleto) => {
        const data1 = moment().format('DD/MM/YYYY')
        const hoje = moment(data1, 'DD/MM/YYYY')
        const vencimento = moment(boleto.dataVencimento, 'DD/MM/YYYY')
        let diferencaDias = hoje.diff(vencimento, 'days')

        console.log();

        if (vencimento.isBefore(hoje)) {
          console.log(`Boleto ${boleto._id} está atrasado`);
          await Boleto.findByIdAndUpdate(boleto._id, { $set: { status: 'Atrasado' } });

            
        }
      });

});


// se o cliente estiver com alguem boleto com o status atrasado, desative os agendamentos dele.
cron.schedule('*/5 * * * * *', async () =>{

    const boletos = await Boleto.find({ status: 'Atrasado' });

    boletos.forEach(async (boleto) =>{
        const data1 = moment().format('DD/MM/YYYY')
        const hoje = moment(data1, 'DD/MM/YYYY')
        const vencimento = moment(boleto.dataVencimento, 'DD/MM/YYYY')
        let diferencaDias = hoje.diff(vencimento, 'days')


        if(diferencaDias >= 7){
            
            const cliente = await Cliente.findById(boleto.clienteId)
            cliente.status = 'Inativo'
            await cliente.save()
            const clienteAgendamentos = await Agendamento.find({clienteId: boleto.clienteId})
            clienteAgendamentos.forEach(async (agendamento) => {
    
                  agendamento.status = 'Inativo'
                  await agendamento.save() 

                //   console.log(`os agendamentos do ${cliente.nome} ${cliente.sobrenome}, estao sendo desativados por atraso no pagamento da mensalidade`);
            });
          }
    })

    
})

exports.financeiro = async (req,res) =>{


    res.render('admin/financeiro/financeiro')
}



exports.pagamentos = async (req,res) => {
    try {
        const boletos = await Boleto.find().sort({status: -1})
       

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

// exports.filtrarPagamento = async (req,res) =>{
    
// }

exports.pagamentosSearch = async (req,res) =>{
    try {

        const searchTerm = req.body.searchTerm.trim();
        const searcNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const searchTermIsNumber = !isNaN(searcNoSpecialChar);

        if (searchTermIsNumber) {
            const cpfWithoutSpecialChar = searcNoSpecialChar.replace(/[^\d]/g, "");
            const cpfWithSpecialCharRegex = new RegExp(cpfWithoutSpecialChar.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));
  
            const boletos = await Boleto.find({
              $or: [
                {
                  clienteCpf: cpfWithSpecialCharRegex,
                },
                {
                  clienteCpf: cpfWithoutSpecialChar,
                },
              ],
            });
  
            res.render('admin/financeiro/search-pagamento', {
                boletos,
            })
          
          } else {
            const boletos = await Boleto.find({
                $or: [
                    {
                        clienteNome: { $regex: new RegExp(searcNoSpecialChar, "i")}
                    },
              ],
            });
            res.render('admin/financeiro/search-pagamento', {
                boletos,
            })
          
          }
        
    } catch (error) {
        console.log(error);
    }
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
            clienteCpf: cliente.cpf,
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



// search for create a new cobrança
exports.searchCliente = async (req,res) =>{

   try {
    const clientesAcademia = await Cliente.aggregate([
        { $sort: { nome: 1 } }
        ]).exec();
        // console.log(clientesAcademia);

    res.render('admin/financeiro/search-cliente', {clientesAcademia})
   } catch (error) {
    console.log(error);
   }
}

exports.searchClientePost = async (req,res) =>{
    try {
        let searchTerm = req.body.searchTerm.trim();
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        let searchTermWithSpace =  req.body.searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        // verificando se tem espaço no search term.
        let searchRegex;
        if (searchTermWithSpace.includes(' ')) {
          const [firstName, lastName] = searchTermWithSpace.split(' ');
          searchRegex = new RegExp(`^${firstName}.*${lastName}$`, "i");
        } else {
          searchRegex = new RegExp(searchTermWithSpace, "i");
        }

        // verificando se é numero
        const searchTermIsNumber = !isNaN(searchNoSpecialChar);
        if (searchTermIsNumber) {
            const cpfWithoutSpecialChar = searchNoSpecialChar.replace(/[^\d]/g, "");
            const cpfWithSpecialCharRegex = new RegExp(cpfWithoutSpecialChar.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));

            const clientesAcademia = await Cliente.find({
                $or: [
                    {
                      cpf: cpfWithSpecialCharRegex,
                    },
                    {
                      cpf: cpfWithoutSpecialChar,
                    },
                  ],
              });

            res.render('admin/financeiro/search-cliente', { clientesAcademia });

        
        }else{
            const clientesAcademia = await Cliente.find({
                $or: [
                  // Pesquisa por nome ou sobrenome
                  { nome: { $regex: searchRegex } },
                  { sobrenome: { $regex: searchRegex } },
            
                  // Pesquisa por e-mail
                  { email: { $regex: searchRegex } },
            
                  // Pesquisa por CPF
                  { cpf: { $regex: searchRegex } }
                ]
              });
        
        res.render('admin/financeiro/search-cliente', { clientesAcademia });

        }

      
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

        let id = req.params.id

        const boleto = await Boleto.findByIdAndUpdate(req.params.id, {
            status: 'Pago',
            // transictionHash: bcrypt.hashSync(id, 10)
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

        // console.log(boleto);

        const previousUrl = req.get('referer') 
        // res.redirect(`/dashboard/financeiro/pagamento/historico/${boleto.clienteId}`)
        res.redirect(previousUrl)
    } catch (error) {
        console.log(error);
    }

}