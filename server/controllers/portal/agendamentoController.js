const Agendamentos = require('../../models/Agendamento')
const Instrutor = require('../../models/Instrutores')
const Cliente = require('../../models/Cliente')
const { ObjectId } = require('bson');
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


exports.agendamento = async (req,res) =>{
   
    
        try {

             // ! id do usuario logado
            // ? usuario teste
            // let clienteTeste = await Cliente.findOne({cpf: '256.369.343-74'})
            let id = new ObjectId(req.session.userId)

            let msg = await req.consumeFlash('excluido')
            let msgErro = await req.consumeFlash('inativo')

            const cursor = Agendamentos.aggregate([
                { $match: { clienteId: id, status: 'Ativo' } }
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
        
            res.render('portal/agendamento/user-agendamento', {
                agendamentos,
                msg,
                msgErro
            });
        } catch (error) {
            console.log(error);
        }

}

exports.agendamentoVer = async (req,res) =>{
   

    
    // res.render('portal/agendamento/ver')
    try {
        
        // const agendamento = await Agendamentos.findOne({ _id: id })
        const agendamento = await Agendamentos.findOne({ _id: req.params.id })
    
    
        res.render('portal/agendamento/ver', {
          agendamento
        })
    
      } catch (error) {
        console.log(error);
      }


}
exports.agendamentoCriar = async (req,res) =>{
    // res.render('portal/agendamento/criar-agendamento')
    try {
        // ! id do usuario logado
        let id = req.session.userId
        const cliente = await Cliente.findOne({ _id: id })
        // const cliente = await Cliente.findOne({ _id: req.params.id })

        if(cliente.status == 'Ativo'){
            let msgErro = await req.consumeFlash('AgendamentoMsg')
            let msgSucesso = await req.consumeFlash('AgendamentoMsgSucesso')
            res.render('portal/agendamento/criar-agendamento',{cliente, msgErro, msgSucesso})
        }else{
            await req.flash('inativo',`Não é possivel criar Agendamentos para usuarios Inativos`)
            const previousUrl = req.get('referer') 
            res.redirect(previousUrl)
        }

    } catch (error) {
        console.log(error);
    }

}
exports.agendamentoCriarPost = async (req,res) =>{
    
    // res.send('ok')
        // ! id do usuario logado
        const {cliente, instrutor, modalidade, dia, horario} = req.body

        const clienteId = cliente
        const nomeModalidade = modalidade
        const instrutorId = instrutor
        const diaAgendamento = interpretarData(dia)
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
                        // ! atualizar com cliente ID
                        // res.redirect(`portal/agendamento/criar/novo/${clienteId}`)
                        res.redirect(`/portal/agendamento/criar/novo/`)

                    } 
                    else {
                        // Verifique se o cliente já tem dois agendamentos para o dia, independentemente da modalidade
                        const agendamentosDoClienteNoDia = await Agendamentos.find({
                            clienteId: novoAgendamento.clienteId,
                            dia: novoAgendamento.dia
                        });
                        
                        if (agendamentosDoClienteNoDia.length >= 2) {
                            // Cliente já tem 2 agendamentos para o mesmo dia
                            // Retorne um erro ou uma mensagem para o usuário
                            await req.flash('AgendamentoMsg',`${clienteDados.nome}  já tem 2 agendamentos neste dia`)
                        // ! atualizar com cliente ID
                        // res.redirect(`portal/agendamento/criar/novo/${clienteId}`)
                        res.redirect(`/portal/agendamento/criar/novo/`)

                        } 
                        else {
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

                                await req.flash('AgendamentoMsg',`${clienteDados.nome}  já tem um agendamento neste dia e horário.`)
                                // ! ATUALIZAR COM CLIENTE ID
                                // res.redirect(`portal/agendamento/criar/novo/${clienteId}`)
                                res.redirect(`/portal/agendamento/criar/novo/`)
                            } 
                            else {
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
                                    // ! ATUALZIAR COM CLIENTE ID
                                    // res.redirect(`/acadmin/agendamento/criar/novo/${clienteId}`)
                                    res.redirect(`/portal/agendamento/criar/novo/`)
                                } 
                                else {
                                    // Todas as verificações passaram, crie o novo agendamento
                                    await novoAgendamento.save();
                                    await req.flash('AgendamentoMsgSucesso',`Agendamento criado com sucesso.`)
                                    // ! ATUALizar com cliente ID
                                    // res.redirect(`/acadmin/agendamento/criar/novo/${clienteId}`)
                                    res.redirect(`/portal/agendamento/criar/novo/`)
                                }
                            }
                        }
                    }
            
            //   await novoAgendamento.save();
            //   await req.flash('AgendamentoMsgSucesso',`Agendamento criado com sucesso.`)
            //   res.redirect(`/dashboard/agendamento`)
            
            } catch (error) {
                console.log(error);
                return res.status(400).send({ error: error.message });
        }




}


exports.agendamentoEdit = async (req,res) =>{
        
        // res.render('portal/agendamento/edit')


        let msgErro = await req.consumeFlash('editMsg')
        let msgSucesso = await req.consumeFlash('editMsgSucesso')
     
     
        try {
            // ! id do usuario logado
            // let clienteTeste = await Cliente.findOne({cpf: '256.369.343-74'})
            // let id = clienteTeste._id
            const agendamento = await Agendamentos.findOne({ _id: req.params.id })
            // const agendamento = await Agendamentos.findOne({ _id: req.params.id })

            if(agendamento.status == "Ativo") {
                let dia = interpretarData(agendamento.dia, "YYYY-MM-DD")
            
                const instrutores = await Instrutor.find({modalidade: agendamento.modalidade}).select('nome _id sobrenome');
                
                
                res.render('portal/agendamento/edit', {
                    agendamento,
                    instrutores,
                    dia,
                    msgErro,
                    msgSucesso
                })
            }if(agendamento.status == "Inativo"){
                res.redirect('/portal/agendamento/')
            }
            
           
        
        } catch (error) {
            console.log(error);
        }



}
exports.agendamentoEditPut = async (req,res) =>{
    // ! id do usuario logado
    // res.send('ok')


    const {horario, dia, instrutor, cliente, status} = req.body
    let clienteId = cliente
    let instrutorId = instrutor
    const horarioComeca = moment(horario, 'HH:mm').format('HH:mm')
    const horarioTermina = moment(horario, 'HH:mm').add(1,'hour').format('HH:mm')
    const diaAgendamento = interpretarData(dia)

    const instrutorDados = await Instrutor.findOne({ _id: instrutorId }, { nome: 1, sobrenome: 1,_id: 0 })
    const clienteDados = await Cliente.findOne({ _id: clienteId }, { nome: 1, sobrenome: 1,_id: 0 })

    const agendamentoId = req.params.id
    

    const limiteAgendamentos = 2; // define o limite de agendamentos por dia para o cliente
    const agendamentosDoClienteNoDia = await Agendamentos.find({
    clienteId: clienteId,
    dia: diaAgendamento
    });

    if (agendamentosDoClienteNoDia.length >= limiteAgendamentos && !agendamentosDoClienteNoDia.some(a => a._id.equals(agendamentoId))) {
    // Cliente já tem limiteAgendamentos agendamentos para o mesmo dia, mas permite atualizar o agendamento existente
    await req.flash('editMsg',`${clienteDados.nome}  já tem ${limiteAgendamentos} agendamentos neste dia`)
    res.redirect(`/portal/agendamento/edit/${agendamentoId}`)
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
        res.redirect(`/portal/agendamento/edit/${agendamentoId}`)
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
        res.redirect(`/portal/agendamento/edit/${agendamentoId}`)
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
        res.redirect(`/portal/agendamento/edit/${agendamentoId}`)
        }
    }
    }


}

exports.agendamentoDelete= async (req,res) =>{
    // ! id do usuario logado
    // res.send('ok')

    try {
        const agendamento = await Agendamentos.findByIdAndDelete(req.params.id)

        if (!agendamento) {
            return res.status(404).send("Esse agendamento nao existe");
        }else{
            await req.flash('excluido',`Seu agendamento com o instrutor ${agendamento.instrutorNome} no dia ${agendamento.dia} as ${agendamento.horarioComeca} foi excluido`)
        }

        res.redirect('/portal/agendamento/')
    } catch (error) {
        console.log(error);
        
    }
}


exports.agendamentoHistorico = async (req,res) =>{
    // ! id do usuario logado

    // res.render('portal/agendamento/historico')

    try {
         // ! id do usuario logado
        // ? usuario teste
        // let clienteTeste = await Cliente.findOne({cpf: '256.369.343-74'})
        let id = req.session.userId

        //! const id = req.params.id
        const cursor = await Agendamentos.find({clienteId: id}).sort({status: 1}).cursor()

        const agendamentosAtivos = await cursor.toArray();

        const agendamentos = agendamentosAtivos.sort((a, b) => {
            const diaA = moment(a.dia, 'DD/MM/YYYY');
            const diaB = moment(b.dia, 'DD/MM/YYYY');
        
            if (diaA.isBefore(diaB)) {
            return 1;
            } else if (diaA.isAfter(diaB)) {
            return -1;
            } else {
            const horarioComecaA = moment(a.horarioComeca, 'HH:mm');
            const horarioComecaB = moment(b.horarioComeca, 'HH:mm');
            return horarioComecaA.isBefore(horarioComecaB) ? -1 : 1;
            }
        });




        const clienteDados = await Cliente.findById(id, {nome: 1, sobrenome: 1, _id: 0})
        const nomeCompleto = `${clienteDados.nome} ${clienteDados.sobrenome}`
        res.render('portal/agendamento/historico', {
          agendamentos,
          nomeCompleto
        })
    
      } catch (error) {
        console.log(error);
      }


}

exports.instrutoresModalidade = async (req,res) =>{
    // res.send('ok')
    let lowerCase = req.params.modalidade
        const modalidade = lowerCase.charAt(0).toUpperCase() + lowerCase.substring(1)
      
        const instrutores = await Instrutor.find({modalidade: modalidade, status: 'Ativo'},{_id: 1, nome: 1, sobrenome: 1})
      
       res.send(instrutores)

}
exports.instrutoresHorarios = async (req,res) =>{
    // res.send('ok')

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