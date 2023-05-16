const Cliente = require('../../models/Cliente')
const Boleto = require('../../models/boleto')
const bcrypt = require('bcryptjs')
const moment = require('moment'); // require
// const cron = require('node-cron');
// const Agendamento = require('../../models/Agendamento');
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


// ! Financeiro
    // ? get page pagamentos
    exports.financeiroPagamentos = async (req,res) =>{

        // res.render('atendente/financeiro/pagamentos')

        try {
            const boletos = await Boleto.find().sort({status: -1})
    
            // let count = await Boleto.count()
            res.render('atendente/financeiro/pagamentos', {
                boletos,
                // current: page,
                // number, 
                // pages: Math.ceil(count / perpage),
            })
        } catch (error) {
            console.log(error);
        }

    }
    // * pagamentos search
    exports.pagamentosSearch = async (req,res) =>{
        // res.render('atendente/financeiro/search-pagamento')


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
      
                res.render('atendente/financeiro/search-pagamento', {
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
                res.render('atendente/financeiro/search-pagamento', {
                    boletos,
                })
              
              }
            
        } catch (error) {
            console.log(error);
        }


    }
    // ? get pagamentos criar search cliente
    exports.pagamentoSearchCliente = async (req,res) =>{
        // res.render('atendente/financeiro/search-cliente')

        try {
            const clientesAcademia = await Cliente.aggregate([
                { $sort: { nome: 1 } }
                ]).exec();
                // console.log(clientesAcademia);
        
            res.render('atendente/financeiro/search-cliente', {clientesAcademia})
           } catch (error) {
            console.log(error);
           }



    }
    // * post search cliente
    exports.pagamentoSearchClientePost = async (req,res) =>{
        // res.send('ok')

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
    
                res.render('atendente/financeiro/search-cliente', { clientesAcademia });
    
            
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
            
            res.render('atendente/financeiro/search-cliente', { clientesAcademia });
    
            }
    
          
          } catch (error) {
            console.log(error);
          }


    }
    // ? get pagamento cria nova cobrança
    exports.pagamentoNovaCobranca = async (req,res) =>{
        // res.render('atendente/financeiro/criar-pagamento')

        try {
            const cliente = await Cliente.findOne({ _id: req.params.id })
            let msgErro = await req.consumeFlash('AgendamentoMsg')
            let msgSucesso = await req.consumeFlash('AgendamentoMsgSucesso')
        
            const tipos = ['Mensalidade', 'Mensalidade com Atraso']
            
             
            res.render('atendente/financeiro/criar-pagamento', {cliente, msgErro, msgSucesso, tipos})
          } catch (error) {
            console.log(error);
          }

    }
    // * post criar nova cobrança
    exports.pagamentoNovaCobrancaPost = async (req,res) =>{
        // res.send('ok')

        try {
            const {valor, dataEmissao, dataVencimento, tipo} = req.body
            const cliente = await Cliente.findOne({ _id: req.params.id })
    
            let dataEmissaoFormatada = interpretarData(dataEmissao)
            let dataVencimentoFormatada = interpretarData(dataVencimento)
            const cobrança = new Boleto({
                clienteId: cliente._id,
                clienteCpf: cliente.cpf,
                clienteNome: `${cliente.nome} ${cliente.sobrenome}`,
                valor: valor,
                tipo: tipo,
                dataEmissao: dataEmissaoFormatada,
                dataVencimento: dataVencimentoFormatada,
            })
    
            await cobrança.save()
    
    
            res.redirect('/acadmin/financeiro/pagamentos')
        } catch (error) {
            console.log(error);
        }
    }
    // ? get cliente historico de pagamentos
    exports.historicoPagamentos = async (req,res) =>{
        // res.render('atendente/financeiro/historico')

        try {
            const Id = req.params.id
            const boletos = await Boleto.find({clienteId: Id})
            // console.log(boletos);
            
            res.render('atendente/financeiro/historico', {boletos} )
        } catch (error) {
            console.log(error);
        }
    }
    // * pagar boleto/cobrança
    exports.boletoPago = async (req,res) =>{
        // res.send('ok')
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
    
            // res.redirect(`/dashboard/financeiro/pagamento/historico/${boleto.clienteId}`)
            res.redirect(`/acadmin/financeiro/pagamentos`)
        } catch (error) {
            console.log(error);
        }

    }
    // * excluir boleto/cobrança
    //  TODO exports.excluirBoleto = async (req,res) =>{}

    // * pagar boleto/cobrança no historico do cliente
    exports.boletoPagoPessoal = async (req,res) =>{
        // res.send('ok')
        try {

            let id = req.params.id
            let dataPagamentoFormatada = interpretarData(moment())
             const boleto = await Boleto.findByIdAndUpdate(req.params.id, {
                 status: 'Pago',
                 transactionHash: bcrypt.hashSync(id, 10),
                 dataPagamento: dataPagamentoFormatada
                 // dataPagamento: '09/01/2023'
                 // dataPagamento: '12/02/2023'
                 // dataPagamento: '11/03/2023'
                 // dataPagamento: '14/04/2023'
             })
     
            const cliente = await Cliente.findById(boleto.clienteId)
     
     
             const previousUrl = req.get('referer') 
             
             cliente.status = 'Ativo'
             await cliente.save()
     
             // res.redirect(`/dashboard/financeiro/pagamento/historico/${boleto.clienteId}`)
             res.redirect(previousUrl)
         } catch (error) {
             console.log(error);
         }
    }
    // * excluir boleto/cobrança no historico do cliente
    // TODO exports.excluirBoletoPessoal = async (req,res) =>{}

