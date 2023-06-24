const Cliente = require('../../models/Cliente')
const Agendamento = require('../../models/Agendamento')
const moment = require('moment'); 

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


// ! GERENCIAMENTO
    // ? get page clientes
    exports.gerenciamentoCliente = async (req,res) =>{

        let msg = await req.consumeFlash('excluido')

        
        let perpage = 10;
        let page = req.query.page || 1;
        let number = Number(page)    
            try {
                const clientesAcademia = await Cliente.aggregate([{$sort: {nome: 1} }])
                .exec()
    
                let count = await Cliente.count()
                
                res.render('atendente/gerenciamento/clientes/clientes', {
                  clientesAcademia , 
                  number, 
                  pages: Math.ceil(count / perpage),
                  current: page,
                  msg
                })
    
            } catch (error) {
                console.log(error);
            }


    }
    //? VER
    exports.gerenciamentoClienteVer = async (req,res) => {
        try {
            const clienteAcademia = await Cliente.findOne({ _id: req.params.id })
        
        
            res.render('atendente/gerenciamento/clientes/ver', {
              clienteAcademia
            })
        
          } catch (error) {
            console.log(error);
          }
    }
    //? EDIT
    exports.gerenciamentoClienteEdit = async (req,res) => {
        try {
            const clienteAcademia = await Cliente.findOne({ _id: req.params.id })
            let dataNascimento = interpretarData(clienteAcademia.dataNascimento, 'YYYY-MM-DD')
            res.render('atendente/gerenciamento/clientes/edit', {
              clienteAcademia,
              dataNascimento
            })
        
          } catch (error) {
            console.log(error);
          }
    }
    // * Save edit
    exports.gerenciamentoClienteEditPost = async (req,res) => {
        let dataNascimentoFormatada = interpretarData(req.body.dataNascimento)
        try {
            const clienteAcademia = await Cliente.findByIdAndUpdate(req.params.id,{
                nome: req.body.nome,
                sobrenome: req.body.sobrenome,
                dataNascimento: dataNascimentoFormatada ,
                telefone: req.body.telefone,
                email: req.body.email,
                sexo: req.body.sexo,
                status: req.body.status,
                cpf: req.body.cpf,
                endereco: req.body.endereco,
                dataModificado: moment().format('DD/MM/YYYY HH:mm:ss')
            })
            
            

            await res.redirect(`/acadmin/gerenciamento/clientes/edit/${req.params.id}`);
            console.log('redirected');

          } catch (error) {
            console.log(error);
          }
    }
    // * delete
    exports.gerenciamentoClienteDelete = async (req,res) => {
        try {

            let person = await Cliente.findByIdAndDelete(req.params.id)

            //?  excluindo todos os agendamentos desse cliente
            let agendamentos = await Agendamento.find({clienteId: person.id})
            
            const agendamentoIds = agendamentos.map(agendamento => agendamento._id);

              // Exclua os agendamentos com base nos IDs
              await Agendamento.deleteMany({ _id: { $in: agendamentoIds } });

              // Verifique se os agendamentos foram excluídos com sucesso
              const deletedAgendamentos = await Agendamento.find({ _id: { $in: agendamentoIds } });
          
             await req.flash('excluido',`${person.nome} ${person.sobrenome} foi excluido do sistema, junto com todos os seus agendamentos`)
 
             res.redirect("/acadmin/gerenciamento/clientes")
           } catch (error) {
             console.log(error);
           }
    }
    // * search
    exports.gerenciamentoClienteSearch = async (req,res) => {
        try {
        
            const searchWithSpace = req.body.searchTerm
            const searchTerm = req.body.searchTerm.trim();
            const searchTermWithoutSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
            const searchTermIsNumber = !isNaN(searchTermWithoutSpecialChar);
            
            if(searchTerm.includes('@') || searchTerm.includes('.com')){ 

              const clientesAcademia = await Cliente.find({
                $or: [
                  {email:  searchTerm}
                ]
              })
    
              res.render('atendente/gerenciamento/clientes/search', {
                clientesAcademia,
              })
            
            }
            else if (searchTermIsNumber) {
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
    
              res.render('atendente/gerenciamento/clientes/search', {
                clientesAcademia,
              })
            
            } else {
              const regex = new RegExp(`^${searchWithSpace}`, 'i');
              const clientesAcademia = await Cliente.find({
                $or: [
                  {
                    nome: { $regex: new RegExp(searchTermWithoutSpecialChar, "i") },
                  },
                  {
                    sobrenome: { $regex: new RegExp(searchTermWithoutSpecialChar, "i") },
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
                ],
              });
              res.render('atendente/gerenciamento/clientes/search', {
                clientesAcademia,
              })
            
            }
    
          } catch (error) {
            console.log(error);
          }

    }
