const Admin = require('../../models/Admin')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')
const Boleto = require('../../models/boleto')
const Financa = require('../../models/financas')
const moment = require('moment')
// model


function valorTotal(mes){
  const total = mes.reduce((total, boleto) =>{
    return total += boleto.valor
  }, 0)

  return total
}

function quantidade(mes){
  const total = mes.reduce((total, boleto) =>{
    return total += 1
  }, 0)
  return total
}


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
      let context;
      const {tipo, mesInicio, mesFim} = req.body

      const janeiro = [];
      const fevereiro = [];
      const marco = [];
      const abril = [];
      const maio = [];
      const meses = [];
     
      for (let i = parseInt(mesInicio); i <= parseInt(mesFim); i++) {
      meses.push(i.toString().padStart(2, "0"));
      }

      
     

    if(tipo == 'entradas'){
      const boletosPagos = await Boleto.find({ status: 'Pago' });

      boletosPagos.forEach(boleto => {
        const dataPagamento = moment(boleto.dataPagamento, 'DD/MM/YYYY');
        const mesPagamento = dataPagamento.format('MM');
      
        // Verifique se o mês do pagamento está na lista de meses desejados
        if (meses.includes(mesPagamento)) {
          // Adicione o boleto à variável correspondente ao mês
          switch (mesPagamento) {
            case '01':
              janeiro.push(boleto);
              break;
            case '02':
              fevereiro.push(boleto);
              break;
            case '03':
              marco.push(boleto);
              break;
            case '04':
              abril.push(boleto);
              break;
            case '05':
              maio.push(boleto);
              break;
            // Adicione mais casos para os outros meses, se necessário
          }
        }
      });
      let mes1 = {
        mes: 'Janeiro',
        valorTotal: valorTotal(janeiro),
        quantidade: quantidade(janeiro),
        tipo: 'Mensalidade',
        valor: (valorTotal(janeiro)) / (quantidade(janeiro))
      }
      let mes2 =  {
        mes: 'Fevereiro',
        valorTotal: valorTotal(fevereiro),
        quantidade: quantidade(fevereiro),
        tipo: 'Mensalidade',
        valor: (valorTotal(fevereiro)) / (quantidade(fevereiro))
      }
      let mes3 ={
        mes: 'Março',
        valorTotal: valorTotal(marco),
        quantidade: quantidade(marco),
        tipo: 'Mensalidade',
        valor: (valorTotal(marco)) / (quantidade(marco))
      }
      let mes4 =  {
        mes: 'Abril',
        valorTotal: valorTotal(abril),
        quantidade: quantidade(abril),
        tipo: 'Mensalidade',
        valor: (valorTotal(abril)) / (quantidade(abril))
      }
      let mes5 = {
        mes: 'Maio',
        valorTotal: valorTotal(maio),
        quantidade: quantidade(maio),
        tipo: 'Mensalidade',
        valor: (valorTotal(maio)) / (quantidade(maio))
      }
      const boletoMeses = []
      if(janeiro.length > 0){
        boletoMeses.push(mes1)
      }
      if(fevereiro.length > 0){
        boletoMeses.push(mes2)
      }
      if(marco.length > 0){
        boletoMeses.push(mes3)
      }
      if(abril.length > 0){
        boletoMeses.push(mes4)
      }
      if(maio.length > 0){
        boletoMeses.push(mes5)
      }


        context = {boletoMeses}
        renderedHtml = nunjucks.render('admin/relatorio/financeiro/entradas.njk', context);
    }if(tipo == 'saidas'){
         
        renderedHtml = nunjucks.render('admin/relatorio/financeiro/saidas.njk', context);
    }if(tipo == 'entradasaida'){
        
        renderedHtml = nunjucks.render('admin/relatorio/financeiro/completo.njk', context);
    }


          
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




