const Agendamentos = require('../../models/Agendamento')
const Instrutor = require('../../models/Instrutores')
const Cliente = require('../../models/Cliente')
const mongoose = require('mongoose')
const moment = require('moment'); // require

// formatar data padrao brasileiro


//! dashboard agendamento
exports.agendamento = async (req,res) => {
    let perpage = 10;
    let page = req.query.page || 1;
    let number = Number(page)


  
    try {
    const agendamentos = await Agendamentos.aggregate([
      { $match: { status: 'Ativo' } },
      { $sort: { dia: 1, horarioComeca: 1 } }
    ]).exec();

        let count = Agendamentos.count()

        res.render('admin/agendamento/agendamento', {
            agendamentos,
            current: page,
            number,
            pages: Math.ceil(count / perpage),
            // msg
        })
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

}

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



exports.agendamentoCriar = async (req,res) => {
    const cliente = await Cliente.findOne({ _id: req.params.id })

    let msgErro = await req.consumeFlash('AgendamentoMsg')
    let msgSucesso = await req.consumeFlash('AgendamentoMsgSucesso')
    res.render('admin/agendamento/criar-novo',{cliente, msgErro, msgSucesso})
}

exports.agendamentoCriarPost = async (req,res) => { 
    const {modalidade} = req.body


    const clienteId = req.body.cliente

   

    const cliente = await Cliente.findById(clienteId,["-senha","-endereco"])

    const instrutores = await Instrutor.find({modalidade: modalidade}, ["-endereco"])
    let horarios = [
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
            hora: "12:00"
        },
        {
            hora: "14:00"
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


    // console.log(cliente, instrutores);
    res.render('admin/agendamento/criar-modalidade', {modalidade, instrutores, horarios, cliente})
}

exports.agendamentoCriarAgendamento = async (req,res) =>{
    const {cliente,modalidade,instrutor,dia,horario} = req.body
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



exports.agendamentoEdit = async (req,res) => {
 
    let msgErro = await req.consumeFlash('editMsg')
    let msgSucesso = await req.consumeFlash('editMsgSucesso')

  let horarios = [
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
        hora: "12:00"
    },
    {
        hora: "14:00"
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


  try {
    const agendamento = await Agendamentos.findOne({ _id: req.params.id })

    let dia = moment(agendamento.dia, 'DD-MM-YYYY').format("YYYY-MM-DD")

    const instrutores = await Instrutor.find({modalidade: agendamento.modalidade}) .select('nome _id sobrenome');

    console.log(dia);

    res.render('admin/agendamento/edit', {
      agendamento, instrutores, horarios, dia, msgErro,msgSucesso
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

    try {
        
        const agendamentosDoClienteNoDia = await Agendamentos.find({
            clienteId: clienteId,
            dia: diaAgendamento
          });
        
          if (agendamentosDoClienteNoDia.length >= 2) {
            // Cliente já tem 2 agendamentos para o mesmo dia
            // Retorne um erro ou uma mensagem para o usuário
            await req.flash('editMsg',`${clienteDados.nome}  já tem 2 agendamentos neste dia`)
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
    

    } catch (error) {
        res.status(400).json("erro ", error)
        console.log(error);
    }

    
//    try {
   
//     const agendamento = await Agendamentos.findByIdAndUpdate(req.params.id, {
//         horarioComeca,
//         horarioTermina,
//         dia: diaAgendamento,
//         instrutorId: instrutorId,
//         instrutorNome: `${instrutorDados.nome}  ${instrutorDados.sobrenome}`
//     })

//     await req.flash('editMsgSucesso', `Agendamento atualizado com sucesso`)
//     res.redirect(`/dashboard/agendamento/edit/${agendamentoId}`)

//    } catch (error) {
//     console.log(error);
//    }


    
}


// exports.agendamentoDelete = async (req,res) => {
//     try {
//         let agendamento = await Agendamentos.findByIdAndDelete(req.params.id)

//         if (!agendamento) {
//             return res.status(404).send();
//         }else{
//             await req.flash('excluido',`o agendamento do cliente ${agendamento.cliente}, com o instrutor ${agendamento.instrutor} no dia ${agendamento.dia} foi excluido`)
//         }

//         res.redirect('/dashboard/agendamento/agenda')
//     } catch (error) {
//         console.log(error);
        
//     }

// }

