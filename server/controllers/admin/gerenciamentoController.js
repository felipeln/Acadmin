const Cliente = require('../../models/Cliente')
const Funcionario = require('../../models/Funcionario')
const Instrutor = require('../../models/Instrutores')
const mongoose = require('mongoose')


// dashboard admin gerenciamento
 //! * Funcionarios
exports.funcionarios = async (req,res) => {

    let msg = await req.consumeFlash('excluido')

    let perpage = 10;
    let page = req.query.page || 1;
    let number = Number(page)
   
        try {
            const funcionariosAcademia = await Funcionario.aggregate([{$sort: {nome: 1} }])
            .skip(perpage * page - perpage)
            .limit(perpage)
            .exec()

            // length

            let count = await Funcionario.count()

            res.render('admin/gerenciamento/funcionarios/funcionarios', {
              funcionariosAcademia, 
              current: page, 
              number, 
              pages: Math.ceil(count / perpage),
              msg
              })

        } catch (error) {
            console.log(error);
        }

    }

    // * ver
    exports.FuncionarioVer = async (req,res) => {

        try {
            const FuncionariosAcademia = await Funcionario.findOne({ _id: req.params.id })
        
        
            res.render('admin/gerenciamento/funcionarios/ver', {
              FuncionariosAcademia
            })
        
          } catch (error) {
            console.log(error);
          }

    }

    //* edit
    exports.FuncionarioEdit = async (req,res) => {

        try {
            const FuncionariosAcademia = await Funcionario.findOne({ _id: req.params.id })

            res.render('admin/gerenciamento/funcionarios/edit', {
              FuncionariosAcademia
            })
        
          } catch (error) {
            console.log(error);
          }

    }
    //* salvar edit
    exports.FuncionarioEditPost = async (req,res) => {

        try {
            const FuncionarioAcademia = await Funcionario.findByIdAndUpdate(req.params.id,{
                nome: req.body.nome,
                sobrenome: req.body.sobrenome,
                dataNascimento: req.body.dataNascimento,
                telefone: req.body.telefone,
                email: req.body.email,
                senha: req.body.senha,
                sexo: req.body.sexo,
                status: req.body.status,
                cargo: req.body.cargo,
                endereco: req.body.endereco,
                cpf: req.body.cpf,
                dataModificado: Date.now()
            })
            
            

            await res.redirect(`/dashboard/gerenciamento/Funcionarios/edit/${req.params.id}`);
            console.log('redirected');

          } catch (error) {
            console.log(error);
          }

    }

    //* delete 
    exports.FuncionarioDelete = async (req,res) => {
        try {

            let person = await Funcionario.findByIdAndDelete(req.params.id)
        
            await req.flash('excluido',`${person.nome} ${person.sobrenome} foi excluido do sistema`)

            res.redirect("admin/gerenciamento/funcionarios/funcionarios")
          } catch (error) {
            console.log(error);
          }
    }

    // ? search
    exports.FuncionarioSearch= async (req,res) => {

              
      try {
        let searchTerm = req.body.searchTerm
        const searcNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const FuncionariosAcademia = await Funcionario.find({
            $or: [
                {
                    nome: { $regex: new RegExp(searcNoSpecialChar, "i")}
                },
                
                {
                    sobrenome: { $regex: new RegExp(searcNoSpecialChar, "i")}
                },

            ]
        })

        res.render('admin/gerenciamento/funcionarios/search', {
        FuncionariosAcademia,
      })
    
    } catch (error) {
        console.log(error);
    }


}




//! *  Clientes
    exports.Clientes = async (req,res) => {

      let msg = await req.consumeFlash('excluido')

        
    let perpage = 10;
    let page = req.query.page || 1;
    let number = Number(page)    
        try {
            const clientesAcademia = await Cliente.aggregate([{$sort: {nome: 1} }])
            .skip(perpage * page - perpage)
            .limit(perpage)
            .exec()

            let count = await Cliente.count()
            
            res.render('admin/gerenciamento/clientes/clientes', {
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
    

    //* ver
    exports.ClienteVer = async (req,res) => {

     


        try {
            const clienteAcademia = await Cliente.findOne({ _id: req.params.id })
        
        
            res.render('admin/gerenciamento/clientes/ver', {
              clienteAcademia
            })
        
          } catch (error) {
            console.log(error);
          }

    }

    //* edit
    exports.ClienteEdit = async (req,res) => {

        try {
            const clienteAcademia = await Cliente.findOne({ _id: req.params.id })

            res.render('admin/gerenciamento/clientes/edit', {
              clienteAcademia
            })
        
          } catch (error) {
            console.log(error);
          }

    }
    //* salvar edit
    exports.ClienteEditPost = async (req,res) => {

        try {
            const clienteAcademia = await Cliente.findByIdAndUpdate(req.params.id,{
                nome: req.body.nome,
                sobrenome: req.body.sobrenome,
                dataNascimento: req.body.dataNascimento,
                telefone: req.body.telefone,
                email: req.body.email,
                senha: req.body.senha,
                sexo: req.body.sexo,
                status: req.body.status,
                cpf: req.body.cpf,
                dataModificado: Date.now()
            })
            
            

            await res.redirect(`/dashboard/gerenciamento/clientes/edit/${req.params.id}`);
            console.log('redirected');

          } catch (error) {
            console.log(error);
          }

    }

    //* delete 
    exports.ClienteDelete = async (req,res) => {
        try {

           let person = await Cliente.findByIdAndDelete(req.params.id)
        
            await req.flash('excluido',`${person.nome} ${person.sobrenome} foi excluido do sistema`)

            res.redirect("/dashboard/gerenciamento/clientes")
          } catch (error) {
            console.log(error);
          }
    }
    // ? search 
    exports.ClienteSearch= async (req,res) => {
        

           
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
      
              res.render('admin/gerenciamento/clientes/search', {
              clientesAcademia,
            })
          
          } catch (error) {
              console.log(error);
          }
      

    }


//! *Instrutores
    exports.Instrutores = async (req,res) => {

    let msg = await req.consumeFlash('excluido')
             
    let perpage = 10;
    let page = req.query.page || 1;
    let number = Number(page) 

        try {
            const InstrutoresAcademia = await Instrutor.aggregate([{$sort: {nome: 1} }])
            .skip(perpage * page - perpage)
            .limit(perpage)
            .exec()

            let count = await Instrutor.count()

            res.render('admin/gerenciamento/instrutores/instrutores', {
              InstrutoresAcademia, 
              current: page,
              number, 
              pages: Math.ceil(count / perpage),
              msg
            })

        } catch (error) {
            console.log(error);
        }

    }

    //* ver
    exports.InstrutorVer = async (req,res) => {

        try {
            const InstrutoresAcademia = await Instrutor.findOne({ _id: req.params.id })
        
        
            res.render('admin/gerenciamento/instrutores/ver', {
              InstrutoresAcademia
            })
        
          } catch (error) {
            console.log(error);
          }

    }

    //* edit
    exports.InstrutorEdit = async (req,res) => {

        try {
            const InstrutoresAcademia = await Instrutor.findOne({ _id: req.params.id })

            res.render('admin/gerenciamento/instrutores/edit', {
              InstrutoresAcademia
            })
        
          } catch (error) {
            console.log(error);
          }

    }
    //* salvar edit
    exports.InstrutorEditPost = async (req,res) => {

        try {
            const InstrutoresAcademia = await Instrutor.findByIdAndUpdate(req.params.id,{
              nome: req.body.nome,
              sobrenome: req.body.sobrenome,
              dataNascimento: req.body.dataNascimento,
              telefone: req.body.telefone,
              email: req.body.email,
              senha: req.body.senha,
              sexo: req.body.sexo,
              status: req.body.status,
              modalidade: req.body.modalidade,
              cargo: req.body.cargo,
              endereco: req.body.endereco,
              cpf: req.body.cpf,
              dataModificado: Date.now()
            })
            
            

            await res.redirect(`/dashboard/gerenciamento/instrutores/edit/${req.params.id}`);
            console.log('redirected');

          } catch (error) {
            console.log(error);
          }

    }

    //* delete 
    exports.InstrutorDelete = async (req,res) => {
        try {

            let person = await Instrutor.findByIdAndDelete(req.params.id)
        
            await req.flash('excluido',`${person.nome} ${person.sobrenome} foi excluido do sistema`)

            res.redirect("/dashboard/gerenciamento/instrutores")
          } catch (error) {
            console.log(error);
          }
    }

    // ? search 
    exports.InstrutorSearch= async (req,res) => {
            

              
          try {
            let searchTerm = req.body.searchTerm
            const searcNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

            const InstrutoresAcademia = await Instrutor.find({
                $or: [
                    {
                        nome: { $regex: new RegExp(searcNoSpecialChar, "i")}
                    },
                    
                    {
                        sobrenome: { $regex: new RegExp(searcNoSpecialChar, "i")}
                    },

                ]
            })

            res.render('admin/gerenciamento/instrutores/search', {
            InstrutoresAcademia,
          })
        
        } catch (error) {
            console.log(error);
        }


    }

