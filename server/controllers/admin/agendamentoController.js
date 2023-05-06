const Agendamentos = require('../../models/Agendamento')
const Instrutor = require('../../models/Instrutores')
const Cliente = require('../../models/Cliente')
const mongoose = require('mongoose')
const moment = require('moment'); // require
const cron = require('node-cron');
moment.locale('pt-br');
const axios = require('axios')



// Agendar a função para ser executada a cada 1 minuto
cron.schedule('* * * * * * /30', async () => {
  const agendamentosAtivos = await Agendamentos.find({ status: 'Ativo' });

  for (const element of agendamentosAtivos) {
    element.dia
    element.horarioComeca
    const formarDia = `${element.dia} ${element.horarioTermina}`
    const dataAgendada = moment(formarDia, 'DD/MM/YYYY HH:mm')
    const dia2 = moment()
    const diaComparar = moment(dia2, 'DD/MM/YYYY HH:mm')
    if(dataAgendada.isBefore(diaComparar)){
    
        element.status = 'Inativo'
        await element.save()
    }
  }
  

});




//! dashboard agendamento
exports.agendamento = async (req,res) => {


    let msg = await req.consumeFlash('excluido')
    
    try {

      const cursor = await Agendamentos.aggregate([
        {$match: {status: 'Ativo'}}
      ]).cursor();
      
      const agendamentosAtivos = await cursor.toArray();

      const agendamentos = agendamentosAtivos.sort((a, b) => {
        const diaA = moment(a.dia, 'DD/MM/YYYY');
        const diaB = moment(b.dia, 'DD/MM/YYYY');
      
        if (diaA.isBefore(diaB)) {
          return -1;
        } else if (diaA.isAfter(diaB)) {
          return 1;
        } else {
          const horarioComecaA = moment(a.horarioComeca, 'HH:mm');
          const horarioComecaB = moment(b.horarioComeca, 'HH:mm');
          return horarioComecaA.isBefore(horarioComecaB) ? -1 : 1;
        }
      });
      

      res.render('admin/agendamento/agendamento', {
        agendamentos,
        msg
      });
    } catch (error) {
      console.log(error);
    }
    
    

}

exports.agendamentoVer = async (req,res) =>{

    try {
        const agendamento = await Agendamentos.findOne({ _id: req.params.id })
    
    
        res.render('admin/agendamento/ver', {
          agendamento
        })
    
      } catch (error) {
        console.log(error);
      }



}


exports.agendamentoSearch = async (req,res) => {


  try {
    let searchTerm = req.body.searchTerm.trim()
    const searcNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const cursor = await Agendamentos.find({
        $or: [
            {
                clienteNome: { $regex: new RegExp(searcNoSpecialChar, "i")}
            },
            
            {
                instrutorNome: { $regex: new RegExp(searcNoSpecialChar, "i")}
            },
          
        ],
        status: 'Ativo'
    }).cursor()

    const agendamentosAtivos = await cursor.toArray();

    const agendamentos = agendamentosAtivos.sort((a, b) => {
      const diaA = moment(a.dia, 'DD/MM/YYYY');
      const diaB = moment(b.dia, 'DD/MM/YYYY');
    
      if (diaA.isBefore(diaB)) {
        return -1;
      } else if (diaA.isAfter(diaB)) {
        return 1;
      } else {
        const horarioComecaA = moment(a.horarioComeca, 'HH:mm');
        const horarioComecaB = moment(b.horarioComeca, 'HH:mm');
        return horarioComecaA.isBefore(horarioComecaB) ? -1 : 1;
      }
    });



    res.render('admin/agendamento/search-agendamento', {
    agendamentos,
  })

} catch (error) {
    console.log(error);
}



}

// ? pesquisar cliente para agendar
exports.agendamentoClienteSearchView = async (req,res) => {
    try {
        const clientesAcademia = await Cliente.aggregate([
        { $match: { status: 'Ativo' } },
        { $sort: { nome: 1 } }
        ]).exec();
        res.render('admin/agendamento/search-cliente',{clientesAcademia} )
    
    } catch (error) {
        console.log(error);
    }

}
exports.agendamentoClienteSearch = async (req,res) => {

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

        res.render('admin/agendamento/search-cliente', {
        clientesAcademia,
      })
    
    } catch (error) {
        console.log(error);
    }

}

// ? pagina de historico de agendamentos
exports.agendamentoClienteHistorico = async (req,res) => {
  try {
    const id = req.params.id
    const agendamentos = await Agendamentos.find({clienteId: id})

    const clienteDados = await Cliente.findById(id, {nome: 1, sobrenome: 1, _id: 0})
    const nomeCompleto = `${clienteDados.nome} ${clienteDados.sobrenome}`
    res.render('admin/agendamento/historico', {
      agendamentos,
      nomeCompleto
    })

  } catch (error) {
    console.log(error);
  }
}

// ? Rotas novas para criar agendamento.
exports.agendamentoCriar = async (req,res) => {
  const cliente = await Cliente.findOne({ _id: req.params.id })

  

  let msgErro = await req.consumeFlash('AgendamentoMsg')
  let msgSucesso = await req.consumeFlash('AgendamentoMsgSucesso')
  res.render('admin/agendamento/criar-novo',{cliente, msgErro, msgSucesso})
}

exports.instrutoresModalidade = async (req,res) =>{
  let lowerCase = req.params.modalidade
  const modalidade = lowerCase.charAt(0).toUpperCase() + lowerCase.substring(1)

  const instrutores = await Instrutor.find({modalidade: modalidade},{_id: 1, nome: 1, sobrenome: 1})

 res.send(instrutores)
}


exports.instrutoresHorarios = async (req,res) =>{
    const instrutorId = req.params.instrutor
    const dia = req.params.dia
    const agora = moment().format('HH:mm');
    const hoje = moment().format('DD/MM/YYYY')

    let horarios = [
        {
            hora: "08:00"
        },
        {
            hora: "09:00"
        },
        {
            hora: "10:00"
        },
        {
            hora: "11:00"
        },
        {
            hora: "15:00"
        },
        {
            hora: "16:00"
        },
        {
            hora: "17:00"
        },
        {
            hora: "18:00"
        },
        {
            hora: "19:00"
        },
        {
            hora: "20:00"
        },
    ]


    const diaPesquisa = moment(dia, 'YYYY-MM-DD').format('DD/MM/YYYY')


    Agendamentos.find({
      $and: [
        { instrutorId: instrutorId },
        { dia: diaPesquisa },
        { status: 'Ativo' }
      ]
    }).select('horarioComeca')
    .then((agendamentos) => {

      agendamentos.forEach((agendamento) => {
        const index = horarios.findIndex((horario) => horario.hora === agendamento.horarioComeca);
        if (index !== -1) {
          horarios.splice(index, 1);
        }
      });

      if(hoje == diaPesquisa){
        horarios = horarios.filter((horario) => {
          return horario.hora >= agora;

        });
      }
      
      res.json(horarios)
    }).catch((err) => {
      console.error(err);
    });



    
}

exports.novoAgendamento = async (req,res) =>{
  const {cliente, instrutor, modalidade, dia, horario} = req.body


  const clienteId = cliente
  const nomeModalidade = modalidade
  const instrutorId = instrutor
  const diaAgendamento = moment(dia).format('DD/MM/YYYY')
  const horarioComeca = moment(horario, 'HH:mm').format('HH:mm')
  const horarioTermina = moment(horario, 'HH:mm').add(1,'hour').format('HH:mm')
  
  const clienteDados = await Cliente.findOne({ _id: clienteId }, { nome: 1, sobrenome: 1,_id: 0 })
  const instrutorDados = await Instrutor.findOne({ _id: instrutorId }, { nome: 1, sobrenome: 1,_id: 0 })


  // ! Verificaçoes


  try {
      const novoAgendamento = new Agendamentos({
          clienteId: clienteId,
          clienteNome: `${clienteDados.nome} ${clienteDados.sobrenome}` ,
          instrutorId: instrutorId,
          instrutorNome: `${instrutorDados.nome} ${instrutorDados.sobrenome}`,
          modalidade: nomeModalidade,
          dia: diaAgendamento,
          horarioComeca: horarioComeca,
          horarioTermina: horarioTermina
      })
      
      const agendamentosDoClienteNoDiaEModalidade = await Agendamentos.find({
          clienteId: novoAgendamento.clienteId,
          dia: novoAgendamento.dia,
          modalidade: novoAgendamento.modalidade
        });
        
        if (agendamentosDoClienteNoDiaEModalidade.length >= 1) {
          // Cliente já tem um agendamento para a mesma modalidade neste dia
          // Retorne um erro ou uma mensagem para o usuário
          await req.flash('AgendamentoMsg',`${clienteDados.nome}  já tem um agendamento nesta modalidade neste dia`)
          res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
          // res.status(400).json({
          //   message: "Este cliente já tem um agendamento nesta modalidade neste dia."
          // });

        } else {
          // Verifique se o cliente já tem dois agendamentos para o dia, independentemente da modalidade
          const agendamentosDoClienteNoDia = await Agendamentos.find({
            clienteId: novoAgendamento.clienteId,
            dia: novoAgendamento.dia
          });
        
          if (agendamentosDoClienteNoDia.length >= 2) {
            // Cliente já tem 2 agendamentos para o mesmo dia
            // Retorne um erro ou uma mensagem para o usuário
            await req.flash('AgendamentoMsg',`${clienteDados.nome}  já tem 2 agendamentos neste dia`)
          res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
          //   res.status(400).json({
          //     message: "Este cliente já tem 2 agendamentos neste dia."
          //   });
          } else {
            // Verifique se o cliente já tem um agendamento no mesmo horário
            const agendamentoExistente = await Agendamentos.findOne({
              clienteId: novoAgendamento.clienteId,
              dia: novoAgendamento.dia,
              $or: [
                { horarioComeca: novoAgendamento.horarioComeca },
                { horarioTermina: novoAgendamento.horarioTermina }
              ],
              status: 'Ativo'
            });
        
            if (agendamentoExistente) {
              // Cliente já tem um agendamento para o mesmo dia e horários de início e término
              // Retorne um erro ou uma mensagem para o usuário
              // res.status(400).json({
              //   message: "Este cliente já tem um agendamento neste dia e horário."
              // });
              await req.flash('AgendamentoMsg',`${clienteDados.nome}  já tem um agendamento neste dia e horário.`)
              res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
            } else {
              // Verifique se o instrutor já tem um agendamento no mesmo horário
              const instrutorAgendamentoExistente = await Agendamentos.findOne({
                instrutorId: novoAgendamento.instrutorId,
                dia: novoAgendamento.dia,
                $or: [
                  { horarioComeca: novoAgendamento.horarioComeca },
                  { horarioTermina: novoAgendamento.horarioTermina }
                ],
                status: 'Ativo'
              });
            
              if (instrutorAgendamentoExistente) {
                // Instrutor já tem um agendamento para o mesmo dia e horários de início e término
                // Retorne um erro ou uma mensagem para o usuário
                await req.flash('AgendamentoMsg', `O instrutor já tem um agendamento neste dia e horário.`)
                res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
              } else {
                // Todas as verificações passaram, crie o novo agendamento
                await novoAgendamento.save();
                await req.flash('AgendamentoMsgSucesso',`Agendamento criado com sucesso.`)
                res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
              }
            }
          }
        }
      
      //   await novoAgendamento.save();
      //   await req.flash('AgendamentoMsgSucesso',`Agendamento criado com sucesso.`)
      //   res.redirect(`/dashboard/agendamento`)
      
  } catch (error) {
      console.log(error);
      // return res.status(400).send({ error: error.message });
  }


}


// ! Rotas antigas para criar agendamento

// exports.agendamentoCriar = async (req,res) => {
//     const cliente = await Cliente.findOne({ _id: req.params.id })

//     let msgErro = await req.consumeFlash('AgendamentoMsg')
//     let msgSucesso = await req.consumeFlash('AgendamentoMsgSucesso')
//     res.render('admin/agendamento/criar-novo',{cliente, msgErro, msgSucesso})
// }

// ? 2
// exports.agendamentoCriarPost = async (req,res) => { 
//     const {modalidade} = req.body


//     const clienteId = req.body.cliente

   

//     const cliente = await Cliente.findById(clienteId,["-senha","-endereco"])

//     const instrutores = await Instrutor.find({modalidade: modalidade}, ["-endereco"])
//     let horarios = [
//         {
//             hora: "09:00"
//         },
//         {
//             hora: "10:00"
//         },
//         {
//             hora: "11:00"
//         },
//         {
//             hora: "12:00"
//         },
//         {
//             hora: "14:00"
//         },
//         {
//             hora: "15:00"
//         },
//         {
//             hora: "16:00"
//         },
//         {
//             hora: "17:00"
//         },
//         {
//             hora: "18:00"
//         },
//         {
//             hora: "19:00"
//         },
//         {
//             hora: "20:00"
//         },
//     ]


//     // console.log(cliente, instrutores);
//     res.render('admin/agendamento/criar-modalidade', {modalidade, instrutores, horarios, cliente})
// }

// !
// exports.agendamentoCriarAgendamento = async (req,res) =>{
//     const {cliente,modalidade,instrutor,dia,horario} = req.body
//     const clienteId = cliente
//     const nomeModalidade = modalidade
//     const instrutorId = instrutor
//     const diaAgendamento = moment(dia).format('DD/MM/YYYY')
//     const horarioComeca = moment(horario, 'HH:mm').format('HH:mm')
//     const horarioTermina = moment(horario, 'HH:mm').add(1,'hour').format('HH:mm')
   
//     const clienteDados = await Cliente.findOne({ _id: clienteId }, { nome: 1, sobrenome: 1,_id: 0 })
//     const instrutorDados = await Instrutor.findOne({ _id: instrutorId }, { nome: 1, sobrenome: 1,_id: 0 })


//     // ! Verificaçoes


//     try {
//         const novoAgendamento = new Agendamentos({
//             clienteId: clienteId,
//             clienteNome: `${clienteDados.nome} ${clienteDados.sobrenome}` ,
//             instrutorId: instrutorId,
//             instrutorNome: `${instrutorDados.nome} ${instrutorDados.sobrenome}`,
//             modalidade: nomeModalidade,
//             dia: diaAgendamento,
//             horarioComeca: horarioComeca,
//             horarioTermina: horarioTermina
//         })
        
//         const agendamentosDoClienteNoDiaEModalidade = await Agendamentos.find({
//             clienteId: novoAgendamento.clienteId,
//             dia: novoAgendamento.dia,
//             modalidade: novoAgendamento.modalidade
//           });
          
//           if (agendamentosDoClienteNoDiaEModalidade.length >= 1) {
//             // Cliente já tem um agendamento para a mesma modalidade neste dia
//             // Retorne um erro ou uma mensagem para o usuário
//             await req.flash('AgendamentoMsg',`${clienteDados.nome}  já tem um agendamento nesta modalidade neste dia`)
//             res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
//             // res.status(400).json({
//             //   message: "Este cliente já tem um agendamento nesta modalidade neste dia."
//             // });

//           } else {
//             // Verifique se o cliente já tem dois agendamentos para o dia, independentemente da modalidade
//             const agendamentosDoClienteNoDia = await Agendamentos.find({
//               clienteId: novoAgendamento.clienteId,
//               dia: novoAgendamento.dia
//             });
          
//             if (agendamentosDoClienteNoDia.length >= 2) {
//               // Cliente já tem 2 agendamentos para o mesmo dia
//               // Retorne um erro ou uma mensagem para o usuário
//               await req.flash('AgendamentoMsg',`${clienteDados.nome}  já tem 2 agendamentos neste dia`)
//             res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
//             //   res.status(400).json({
//             //     message: "Este cliente já tem 2 agendamentos neste dia."
//             //   });
//             } else {
//               // Verifique se o cliente já tem um agendamento no mesmo horário
//               const agendamentoExistente = await Agendamentos.findOne({
//                 clienteId: novoAgendamento.clienteId,
//                 dia: novoAgendamento.dia,
//                 $or: [
//                   { horarioComeca: novoAgendamento.horarioComeca },
//                   { horarioTermina: novoAgendamento.horarioTermina }
//                 ],
//                 status: 'Ativo'
//               });
          
//               if (agendamentoExistente) {
//                 // Cliente já tem um agendamento para o mesmo dia e horários de início e término
//                 // Retorne um erro ou uma mensagem para o usuário
//                 // res.status(400).json({
//                 //   message: "Este cliente já tem um agendamento neste dia e horário."
//                 // });
//                 await req.flash('AgendamentoMsg',`${clienteDados.nome}  já tem um agendamento neste dia e horário.`)
//                 res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
//               } else {
//                 // Verifique se o instrutor já tem um agendamento no mesmo horário
//                 const instrutorAgendamentoExistente = await Agendamentos.findOne({
//                   instrutorId: novoAgendamento.instrutorId,
//                   dia: novoAgendamento.dia,
//                   $or: [
//                     { horarioComeca: novoAgendamento.horarioComeca },
//                     { horarioTermina: novoAgendamento.horarioTermina }
//                   ],
//                   status: 'Ativo'
//                 });
              
//                 if (instrutorAgendamentoExistente) {
//                   // Instrutor já tem um agendamento para o mesmo dia e horários de início e término
//                   // Retorne um erro ou uma mensagem para o usuário
//                   await req.flash('AgendamentoMsg', `O instrutor já tem um agendamento neste dia e horário.`)
//                   res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
//                 } else {
//                   // Todas as verificações passaram, crie o novo agendamento
//                   await novoAgendamento.save();
//                   await req.flash('AgendamentoMsgSucesso',`Agendamento criado com sucesso.`)
//                   res.redirect(`/dashboard/agendamento/criar/novo/${clienteId}`)
//                 }
//               }
//             }
//           }
       
//         //   await novoAgendamento.save();
//         //   await req.flash('AgendamentoMsgSucesso',`Agendamento criado com sucesso.`)
//         //   res.redirect(`/dashboard/agendamento`)
        
//     } catch (error) {
//         console.log(error);
//         // return res.status(400).send({ error: error.message });
//     }
// }
// ! fim das rotas antigas



// ! -- Rota antiga para editar agendamento
// exports.agendamentoEdit = async (req,res) => {
 
//     let msgErro = await req.consumeFlash('editMsg')
//     let msgSucesso = await req.consumeFlash('editMsgSucesso')

//   let horarios = [
//     {
//         hora: "09:00"
//     },
//     {
//         hora: "10:00"
//     },
//     {
//         hora: "11:00"
//     },
//     {
//         hora: "12:00"
//     },
//     {
//         hora: "14:00"
//     },
//     {
//         hora: "15:00"
//     },
//     {
//         hora: "16:00"
//     },
//     {
//         hora: "17:00"
//     },
//     {
//         hora: "18:00"
//     },
//     {
//         hora: "19:00"
//     },
//     {
//         hora: "20:00"
//     },
// ]


//   try {
//     const agendamento = await Agendamentos.findOne({ _id: req.params.id })

//     let dia = moment(agendamento.dia, 'DD-MM-YYYY').format("YYYY-MM-DD")

//     const instrutores = await Instrutor.find({modalidade: agendamento.modalidade}) .select('nome _id sobrenome');

//     console.log(dia);

//     res.render('admin/agendamento/edit', {
//       agendamento, instrutores, horarios, dia, msgErro,msgSucesso
//     })

//   } catch (error) {
//     console.log(error);
//   }


// }

// ? rota nova para editar agendamento

exports.agendamentoEdit = async (req,res) => {
 
  let msgErro = await req.consumeFlash('editMsg')
  let msgSucesso = await req.consumeFlash('editMsgSucesso')


try {
  const agendamento = await Agendamentos.findOne({ _id: req.params.id })

  let dia = moment(agendamento.dia, 'DD-MM-YYYY').format("YYYY-MM-DD")

  const instrutores = await Instrutor.find({modalidade: agendamento.modalidade}).select('nome _id sobrenome');

  console.log(dia);

  res.render('admin/agendamento/edit', {
    agendamento,
    instrutores,
    dia,
    msgErro,
    msgSucesso
    // , instrutores, horarios, dia, msgErro,msgSucesso
  })

} catch (error) {
  console.log(error);
}


}

exports.agendamentoEditPut = async (req,res) => {

    const {horario, dia, instrutor, cliente, status} = req.body
    let clienteId = cliente
    let instrutorId = instrutor
    const horarioComeca = moment(horario, 'HH:mm').format('HH:mm')
    const horarioTermina = moment(horario, 'HH:mm').add(1,'hour').format('HH:mm')
    const diaAgendamento = moment(dia).format('DD/MM/YYYY')

    const instrutorDados = await Instrutor.findOne({ _id: instrutorId }, { nome: 1, sobrenome: 1,_id: 0 })
    const clienteDados = await Cliente.findOne({ _id: clienteId }, { nome: 1, sobrenome: 1,_id: 0 })

    const agendamentoId = req.params.id
    

    // ! Verificaçoes

    // try {
        
    //     const agendamentosDoClienteNoDia = await Agendamentos.find({
    //         clienteId: clienteId,
    //         dia: diaAgendamento
    //       });
        
    //       if (agendamentosDoClienteNoDia.length >= 2) {
    //         // Cliente já tem 2 agendamentos para o mesmo dia
    //         // Retorne um erro ou uma mensagem para o usuário
    //         await req.flash('editMsg',`${clienteDados.nome}  já tem 2 agendamentos neste dia`)
    //         res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)
    //       } else {
    //         // Verifique se o cliente já tem um agendamento no mesmo horário
    //         const agendamentoExistente = await Agendamentos.findOne({
    //           clienteId: clienteId,
    //           dia: diaAgendamento,
    //           $or: [
    //             { horarioComeca: horarioComeca },
    //             { horarioTermina: horarioTermina }
    //           ],
    //           _id: { $ne: agendamentoId },
    //           status: 'Ativo'
    //         });
        
    //         if (agendamentoExistente) {
    //           // Cliente já tem um agendamento para o mesmo dia e horários de início e término
    //           // Retorne um erro ou uma mensagem para o usuário
    //           await req.flash('editMsg',`${clienteDados.nome}  já tem um agendamento neste dia e horário.`)
    //           res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)
    //         } else {
    //           // Verifique se o instrutor já tem um agendamento no mesmo horário
    //           const instrutorAgendamentoExistente = await Agendamentos.findOne({
    //             instrutorId: instrutorId,
    //             dia: diaAgendamento,
    //             $or: [
    //               { horarioComeca: horarioComeca },
    //               { horarioTermina: horarioTermina }
    //             ],
    //             _id: { $ne: agendamentoId },
    //             status: 'Ativo'
    //           });
            
    //           if (instrutorAgendamentoExistente) {
    //             // Instrutor já tem um agendamento para o mesmo dia e horários de início e término
    //             // Retorne um erro ou uma mensagem para o usuário
    //             await req.flash('editMsg', `O instrutor já tem um agendamento neste dia e horário.`)
    //             res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)
    //           } else{
    //             await Agendamentos.findByIdAndUpdate(req.params.id, {
    //                 horarioComeca,
    //                 horarioTermina,
    //                 dia: diaAgendamento,
    //                 instrutorId: instrutorId,
    //                 instrutorNome: `${instrutorDados.nome}  ${instrutorDados.sobrenome}`,
    //                 status
    //             })
    //             await req.flash('editMsgSucesso', `Agendamento atualizado com sucesso`)
    //             res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)
    //           }
    //         }
    //     }
    

    // } catch (error) {
    //     res.status(400).json("erro ", error)
    //     console.log(error);
    // }

    const limiteAgendamentos = 2; // define o limite de agendamentos por dia para o cliente
    const agendamentosDoClienteNoDia = await Agendamentos.find({
      clienteId: clienteId,
      dia: diaAgendamento
    });

    if (agendamentosDoClienteNoDia.length >= limiteAgendamentos && !agendamentosDoClienteNoDia.some(a => a._id.equals(agendamentoId))) {
      // Cliente já tem limiteAgendamentos agendamentos para o mesmo dia, mas permite atualizar o agendamento existente
      await req.flash('editMsg',`${clienteDados.nome}  já tem ${limiteAgendamentos} agendamentos neste dia`)
      res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)
    } else {
      // Verifique se o cliente já tem um agendamento no mesmo horário
      const agendamentoExistente = await Agendamentos.findOne({
        clienteId: clienteId,
        dia: diaAgendamento,
        $or: [
          { horarioComeca: horarioComeca },
          { horarioTermina: horarioTermina }
        ],
        _id: { $ne: agendamentoId },
        status: 'Ativo'
      });
      
      if (agendamentoExistente) {
        // Cliente já tem um agendamento para o mesmo dia e horários de início e término
        // Retorne um erro ou uma mensagem para o usuário
        await req.flash('editMsg',`${clienteDados.nome}  já tem um agendamento neste dia e horário.`)
        res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)
      } else {
        // Verifique se o instrutor já tem um agendamento no mesmo horário
        const instrutorAgendamentoExistente = await Agendamentos.findOne({
          instrutorId: instrutorId,
          dia: diaAgendamento,
          $or: [
            { horarioComeca: horarioComeca },
            { horarioTermina: horarioTermina }
          ],
          _id: { $ne: agendamentoId },
          status: 'Ativo'
        });
        
        if (instrutorAgendamentoExistente) {
          // Instrutor já tem um agendamento para o mesmo dia e horários de início e término
          // Retorne um erro ou uma mensagem para o usuário
          await req.flash('editMsg', `O instrutor já tem um agendamento neste dia e horário.`)
          res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)
        } else{
          await Agendamentos.findByIdAndUpdate(req.params.id, {
              horarioComeca,
              horarioTermina,
              dia: diaAgendamento,
              instrutorId: instrutorId,
              instrutorNome: `${instrutorDados.nome}  ${instrutorDados.sobrenome}`,
              status
          })
          await req.flash('editMsgSucesso', `Agendamento atualizado com sucesso`)
          res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)
        }
      }
    }

    
}


exports.agendamentoDelete = async (req,res) => {
    try {
        const agendamento = await Agendamentos.findByIdAndDelete(req.params.id)

        if (!agendamento) {
            return res.status(404).send("Esse agendamento nao existe");
        }else{
            await req.flash('excluido',`o agendamento do cliente ${agendamento.clienteNome}, com o instrutor ${agendamento.instrutorNome} no dia ${agendamento.dia} as ${agendamento.horarioComeca} foi excluido`)
        }

        res.redirect('/dashboard/agendamento')
    } catch (error) {
        console.log(error);
        
    }

}

