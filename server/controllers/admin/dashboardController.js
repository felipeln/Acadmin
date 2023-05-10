const Admin = require('../../models/Admin')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')
const Boleto = require('../../models/boleto')
const Financa = require('../../models/financas')
const { log } = require('console')

// model


// ! dashboard admin

exports.homepage = async (req,res) => {

    res.render('admin/dashboard')
}
exports.admin = async (req,res) => {

    const novoAdmin = new Admin({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            senha: req.body.senha,
    })

    try {

        await Admin.create(novoAdmin)

        console.log('Cadastro realizado');
        
        res.status(200).json({
            sucess: true,
            message: "Administrador cadastrado com sucesso",
            novoAdmin,
        })
    } catch (error) {
    console.log(error); 
    }

}



//! dashboard Relatorios
exports.relatorio = async (req,res) => {
 
    res.render('admin/relatorio/relatorios')

}

    exports.relatorioFinanceiro = async (req,res) => {

        res.render('admin/relatorio/relatorio_financeiro')

    }


    exports.gerarRelatorioFinanceiro = async (req,res) =>{

        let dadosEntrada;
        let dadosSaidas;
        let entradas;
        let saidas;
        let renderedHtml;
        let context;

        const {tipo, mesInicio, mesFim} = req.body

        const meses = [];
        for (let i = parseInt(mesInicio); i <= parseInt(mesFim); i++) {
        meses.push(i.toString().padStart(2, "0"));
        }

        // Constrói o padrão de expressão regular dinamicamente usando o array de meses
        // const regexPattern = `^(${meses.join("|")})/`;
        const regexPattern = `^(0[1-9]|[1-2][0-9]|3[0-1])/((?:${meses.join("|")})/2023)$`

        
        console.log(tipo);

        if(tipo == 'entradas'){
                //  dadosEntrada = await Boleto.find({
                //     status: 'Pago',
                //     dataPagamento: {
                //         $regex: regexPattern
                //     }
                // }).sort([['dataPagamento', 1], ['clienteNome', 1]]);
                dadosEntrada = await Boleto.aggregate([
                    {
                      $match: {
                        status: 'Pago',
                        dataPagamento: {
                          $regex: regexPattern
                        }
                      }
                    },
                    {
                      $addFields: {
                        mesPagamento: {
                          $toInt: {
                            $substr: ['$dataPagamento', 3, 2]
                          }
                        },
                      }
                    },
                    {
                      $sort: {
                        mesPagamento: 1,
                        clienteNome: 1
                      }
                    }
                  ]);
                context = { dadosEntrada}
                 renderedHtml = nunjucks.render('admin/relatorio/financeiro/entradas.njk', context);
        }if(tipo == 'saidas'){
             dadosSaidas = await Financa.find({
                dataPagamento: {
                    $regex: regexPattern
                }
            })
            context = { dadosSaidas}
             renderedHtml = nunjucks.render('admin/relatorio/financeiro/saidas.njk', context);
        }if(tipo == 'completo'){
             entradas = await Boleto.find({
                status: 'Pago',
                dataPagamento: {
                    $regex: regexPattern
                }
            })
             saidas = await Financa.find({
                dataPagamento: {
                    $regex: regexPattern
                }
            })

            context = { entradas, saidas}
             renderedHtml = nunjucks.render('admin/relatorio/financeiro/completo.njk', context);
        }

        let a = await Boleto.find({
            status: 'Pago',
            dataPagamento: '19/01/2023'
        })
        
        



          
        //   const renderedHtml = nunjucks.render('admin/relatorio/financeiro/completo.njk', context);
        
          // Crie uma instância do navegador e crie uma nova página
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
        
          // Defina o conteúdo da página como a saída do template Nunjucks renderizado
          await page.setContent(renderedHtml);
        
          // Gere o PDF a partir da página renderizada
          const pdf = await page.pdf({
            printBackground: true,
            format: 'Letter', 
            // format: 'A4',
            margin: { top: '20px', left: '20px', right: '20px', bottom: '40px' }
          });
        
         
          // Feche o navegador
          await browser.close();

           // Envie o PDF como resposta ao cliente
           res.contentType('application/pdf');
           res.send(pdf);
         
    }


    


    exports.relatorioFuncionario = async (req,res) => {

        res.render('admin/relatorio/relatorio_funcionarios')

    }

    exports.gerarRelatorioFuncionarios = async (req,res) =>{
       

        const browser = await puppeteer.launch({headless: true})


    }

    exports.relatorioClientes = async (req,res) => {

        res.render('admin/relatorio/relatorio_clientes')

    }

    exports.gerarRelatorioClientes = async (req,res) =>{
       

        const browser = await puppeteer.launch({headless: true})


    }




