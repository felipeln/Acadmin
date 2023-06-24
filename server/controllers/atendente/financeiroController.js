const Cliente = require('../../models/Cliente')
const Boleto = require('../../models/boleto')
const bcrypt = require('bcryptjs')
const moment = require('moment'); // require
// const cron = require('node-cron');
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
        try {
            const boletos = await Boleto.find().sort({status: -1})
            
            boletos.sort((a, b) => {
              const dataA = moment(a.dataEmissao, 'DD/MM/YYYY');
              const dataB = moment(b.dataEmissao, 'DD/MM/YYYY');
            
              return dataA.diff(dataB);
            });

            res.render('atendente/financeiro/pagamentos', {
                boletos,

            })
        } catch (error) {
            console.log(error);
        }

    }
    // * pagamentos search
    exports.pagamentosSearch = async (req,res) =>{
        try {

            const searchTerm = req.body.searchTerm.trim();
            const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
            const searchTermIsNumber = !isNaN(searchNoSpecialChar);

            if(searchTerm.includes('/')){
              let currentYear = moment().format('YYYY')
              let data = moment(searchTerm + '/' + currentYear, 'DD/MM/YYYY').format('DD/MM/YYYY')
              
              const boletos = await Boleto.find({
                $or: [
                  {
                    dataPagamento: data
                  }
                ],
              });



              res.render('atendente/financeiro/search-pagamento', {
                boletos,
            })
    
            }
            else if (searchTermIsNumber) {
                const cpfWithoutSpecialChar = searchNoSpecialChar.replace(/[^\d]/g, "");
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
                            clienteNome: { $regex: new RegExp(searchNoSpecialChar, "i")}
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
        try {
            const clientesAcademia = await Cliente.aggregate([
                { $sort: { nome: 1 } }
                ]).exec();
            res.render('atendente/financeiro/search-cliente', {clientesAcademia})
           } catch (error) {
            console.log(error);
           }



    }
    // * post search cliente
    exports.pagamentoSearchClientePost = async (req,res) =>{
      try {
          const searchWithSpace = req.body.searchTerm
          const searchTerm = req.body.searchTerm.trim();
          const searchTermWithoutSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
          const searchTermIsNumber = !isNaN(searchTermWithoutSpecialChar);

            let msgErro = await req.consumeFlash('erro')
            if(searchTerm.includes('@') || searchTerm.includes('.com')){
              
              const clientesAcademia = await Cliente.find({
                $or: [
                  {email:  searchTerm}
                ]
              })

              res.render('atendente/financeiro/search-cliente', { clientesAcademia });

            }else if(searchTermIsNumber){

              const cpfWithoutSpecialChar = searchTermWithoutSpecialChar.replace(/[^\d]/g, "");
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

            }
            else{
              const regex = new RegExp(`^${searchWithSpace}`, 'i');
              const clientesAcademia = await Cliente.find({
                $or: [
                    {
                        nome: { $regex: new RegExp(searchTermWithoutSpecialChar, "i")}
                    },
                    
                    {
                        sobrenome: { $regex: new RegExp(searchTermWithoutSpecialChar, "i")}
                    },
                    {
                      $expr: {
                        $regexMatch: {
                          input: {
                            $concat: [
                              { $ifNull: ['$nome', ''] },
                              ' ',
                              { $ifNull: ['$sobrenome', ''] },
                            ],
                          },
                          regex,
                        },
                      },
                    },

                ]
            })

            res.render('atendente/financeiro/search-cliente', { clientesAcademia });
          }
          
      } catch (error) {
        console.log(error);
      }


    }
    // ? get pagamento cria nova cobrança
    exports.pagamentoNovaCobranca = async (req,res) =>{
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
        try {
            const Id = req.params.id
            const boletos = await Boleto.find({clienteId: Id})
            
            res.render('atendente/financeiro/historico', {boletos} )
        } catch (error) {
            console.log(error);
        }
    }
    // * pagar boleto/cobrança
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
    
            res.redirect(`/acadmin/financeiro/pagamentos`)
        } catch (error) {
            console.log(error);
        }

    }

    // * pagar boleto/cobrança no historico do cliente
    exports.boletoPagoPessoal = async (req,res) =>{
        try {

            let id = req.params.id
            let dataPagamentoFormatada = interpretarData(moment())
             const boleto = await Boleto.findByIdAndUpdate(req.params.id, {
                 status: 'Pago',
                 transactionHash: bcrypt.hashSync(id, 10),
                 dataPagamento: dataPagamentoFormatada
             })
     
            const cliente = await Cliente.findById(boleto.clienteId)
     
     
             const previousUrl = req.get('referer') 
             
             cliente.status = 'Ativo'
             await cliente.save()
     
             res.redirect(previousUrl)
         } catch (error) {
             console.log(error);
         }
    }

