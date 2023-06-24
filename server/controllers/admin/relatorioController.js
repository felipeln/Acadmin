const puppeteer = require('puppeteer')
const nunjucks = require('nunjucks')
const Boleto = require('../../models/boleto')
const Funcionario = require('../../models/Funcionario')
const Cliente = require('../../models/Cliente')
const Financa = require('../../models/financas')
const moment = require('moment')


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


//! dashboard Relatorios
exports.relatorio = async (req,res) => {
 
    res.render('admin/relatorio/relatorios')
}

    exports.relatorioFinanceiro = async (req,res) => {

        res.render('admin/relatorio/relatorio_financeiro')

    }

    exports.gerarRelatorioFinanceiro = async (req,res) =>{
      let context;
      const {tipo, mesInicio, mesFim, estilo} = req.body

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
      const entradas = await Financa.find({tipo: 'Entrada'})

    //   pegando entradas
    entradas.forEach(entrada => {
            const data = moment(entrada.data, 'DD/MM/YYYY')
            const mesCadastrado = data.format('MM')

            if(meses.includes(mesCadastrado)){

                switch (mesCadastrado) {
                    case '01':
                        janeiro.push(entrada);
                        break;
                    case '02':
                        fevereiro.push(entrada);
                        break;
                    case '03':
                        marco.push(entrada);
                        break;
                    case '04':
                        abril.push(entrada);
                        break;
                    case '05':
                        maio.push(entrada);
                        break;
                    // Adicione mais casos para os outros meses, se necessário
                    }
            }
          })
    // pegando boletos pagos
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
        valorTotal: valorTotal(janeiro) ,
        quantidade: quantidade(janeiro),
        tipo: 'Mensalidade',
        valor: ((valorTotal(janeiro)) / (quantidade(janeiro))).toFixed(0)
      }
      let mes2 =  {
        mes: 'Fevereiro',
        valorTotal: valorTotal(fevereiro),
        quantidade: quantidade(fevereiro),
        tipo: 'Mensalidade',
        valor: ((valorTotal(fevereiro)) / (quantidade(fevereiro))).toFixed(0)
      }
      let mes3 ={
        mes: 'Março',
        valorTotal: valorTotal(marco),
        quantidade: quantidade(marco),
        tipo: 'Mensalidade',
        valor: ((valorTotal(marco)) / (quantidade(marco))).toFixed(0)
      }
      let mes4 =  {
        mes: 'Abril',
        valorTotal: valorTotal(abril),
        quantidade: quantidade(abril),
        tipo: 'Mensalidade',
        valor: ((valorTotal(abril)) / (quantidade(abril))).toFixed(0)
      }
      let mes5 = {
        mes: 'Maio',
        valorTotal: (valorTotal(maio)),
        quantidade: quantidade(maio),
        tipo: 'Mensalidade',
        valor: ((valorTotal(maio)) / (quantidade(maio))).toFixed(0)
      }
    //   definindo a variavel boletoMeses e passando os valores para ela.
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
      let valorMedio = 0;
      let qtd = 0;
      let total = 0;
      for (const boleto of boletoMeses) {
       
        qtd += boleto.quantidade
        total += boleto.valorTotal
        
      }
      valorMedio = (total / qtd).toFixed(0)

        context = {boletoMeses, estilo, valorMedio}
        renderedHtml = nunjucks.render('admin/relatorio/financeiro/entradas.njk', context);
    }if(tipo == 'saidas'){
        
        const saidas = await Financa.find({tipo: 'Saida'})
        
        saidas.forEach(async (saida) => {

            const data = moment(saida.data, 'DD/MM/YYYY')
            const mesCadastrado = data.format('MM')
            
            if(meses.includes(mesCadastrado)){

                switch (mesCadastrado) {
                    case '01':
                        janeiro.push(saida);
                        break;
                    case '02':
                        fevereiro.push(saida);
                        break;
                    case '03':
                        marco.push(saida);
                        break;
                    case '04':
                        abril.push(saida);
                        break;
                    case '05':
                        maio.push(saida);
                        break;
                    // Adicione mais casos para os outros meses, se necessário
                    }

            }

        })
        

        let mes1 = {
            mes: 'Janeiro',
            valorTotal: valorTotal(janeiro) ,
            quantidade: quantidade(janeiro),
            tipo: 'Mensalidade',
            valor: ((valorTotal(janeiro)) / (quantidade(janeiro))).toFixed(0)
        }
        let mes2 =  {
            mes: 'Fevereiro',
            valorTotal: valorTotal(fevereiro),
            quantidade: quantidade(fevereiro),
            tipo: 'Mensalidade',
            valor: ((valorTotal(fevereiro)) / (quantidade(fevereiro))).toFixed(0)
        }
        let mes3 ={
            mes: 'Março',
            valorTotal: valorTotal(marco),
            quantidade: quantidade(marco),
            tipo: 'Mensalidade',
            valor: ((valorTotal(marco)) / (quantidade(marco))).toFixed(0)
        }
        let mes4 =  {
            mes: 'Abril',
            valorTotal: valorTotal(abril),
            quantidade: quantidade(abril),
            tipo: 'Mensalidade',
            valor: ((valorTotal(abril)) / (quantidade(abril))).toFixed(0)
        }
        let mes5 = {
            mes: 'Maio',
            valorTotal: (valorTotal(maio)),
            quantidade: quantidade(maio),
            tipo: 'Mensalidade',
            valor: ((valorTotal(maio)) / (quantidade(maio))).toFixed(0)
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


        let valorMedio = 0;
        let qtd = 0;
        let total = 0;
        for (const boleto of boletoMeses) {
       
        qtd += boleto.quantidade
        total += boleto.valorTotal

      }
      valorMedio = (total / qtd).toFixed(0)

        context = {boletoMeses, estilo, valorMedio}
        renderedHtml = nunjucks.render('admin/relatorio/financeiro/saidas.njk', context);
    }if(tipo == 'entradasaida'){

        const janeiroTudo = {saidas: [], entrada: []}
        const fevereiroTudo = {saidas: [], entrada: []}
        const marcoTudo = {saidas: [], entrada: []}
        const abrilTudo = {saidas: [], entrada: []}
        const maioTudo = {saidas: [], entrada: []}

        // saidas
        const saidas = await Financa.find({tipo: 'Saida'})
        

        saidas.forEach(async (saida) => {

            const data = moment(saida.data, 'DD/MM/YYYY')
            const mesCadastrado = data.format('MM')
            
            if(meses.includes(mesCadastrado)){

                switch (mesCadastrado) {
                    case '01':
                        janeiroTudo.saidas.push(saida);
                        break;
                    case '02':
                        fevereiroTudo.saidas.push(saida);
                        break;
                    case '03':
                        marcoTudo.saidas.push(saida);
                        break;
                    case '04':
                        abrilTudo.saidas.push(saida);
                        break;
                    case '05':
                        maioTudo.saidas.push(saida);
                        break;
                    // Adicione mais casos para os outros meses, se necessário
                    }

            }

        })


        // entradas
        const boletosPagos = await Boleto.find({ status: 'Pago' });
        const entradas = await Financa.find({tipo: 'Entrada'})
  
      //   pegando entradas
      entradas.forEach(entrada => {
              const data = moment(entrada.data, 'DD/MM/YYYY')
              const mesCadastrado = data.format('MM')
  
              if(meses.includes(mesCadastrado)){
  
                  switch (mesCadastrado) {
                      case '01':
                          janeiroTudo.entrada.push(entrada);
                          break;
                      case '02':
                          fevereiroTudo.entrada.push(entrada);
                          break;
                      case '03':
                          marcoTudo.entrada.push(entrada);
                          break;
                      case '04':
                          abrilTudo.entrada.push(entrada);
                          break;
                      case '05':
                          maioTudo.entrada.push(entrada);
                          break;
                      // Adicione mais casos para os outros meses, se necessário
                      }
  
              }
          })
      // pegando boletos pagos
        boletosPagos.forEach(boleto => {
          const dataPagamento = moment(boleto.dataPagamento, 'DD/MM/YYYY');
          const mesPagamento = dataPagamento.format('MM');
        
          // Verifique se o mês do pagamento está na lista de meses desejados
          if (meses.includes(mesPagamento)) {
            // Adicione o boleto à variável correspondente ao mês
            switch (mesPagamento) {
                case '01':
                    janeiroTudo.entrada.push(boleto);
                    break;
                case '02':
                    fevereiroTudo.entrada.push(boleto);
                    break;
                case '03':
                    marcoTudo.entrada.push(boleto);
                    break;
                case '04':
                    abrilTudo.entrada.push(boleto);
                    break;
                case '05':
                    maioTudo.entrada.push(boleto);
                    break;
              // Adicione mais casos para os outros meses, se necessário
            }
          }
        });
  

        // ! meses entrada
        let mes1Entrada = {
            mes: 'Janeiro',
            
            valorTotal: valorTotal(janeiroTudo.entrada) ,
            quantidade: quantidade(janeiroTudo.entrada),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(janeiroTudo.entrada)) / (quantidade(janeiroTudo.entrada))).toFixed(0)
        }
        let mes2Entrada =  {
            mes: 'Fevereiro',
            valorTotal: valorTotal(fevereiroTudo.entrada),
            quantidade: quantidade(fevereiroTudo.entrada),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(fevereiroTudo.entrada)) / (quantidade(fevereiroTudo.entrada))).toFixed(0)
        }
        let mes3Entrada ={
            mes: 'Março',
            valorTotal: valorTotal(marcoTudo.entrada),
            quantidade: quantidade(marcoTudo.entrada),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(marcoTudo.entrada)) / (quantidade(marcoTudo.entrada))).toFixed(0)
        }
        let mes4Entrada =  {
            mes: 'Abril',
            valorTotal: valorTotal(abrilTudo.entrada),
            quantidade: quantidade(abrilTudo.entrada),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(abrilTudo.entrada)) / (quantidade(abrilTudo.entrada))).toFixed(0)
        }
        let mes5Entrada = {
            mes: 'Maio',
            valorTotal: (valorTotal(maioTudo.entrada)),
            quantidade: quantidade(maioTudo.entrada),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(maioTudo.entrada)) / (quantidade(maioTudo.entrada))).toFixed(0)
        }
        // ! meses saidas
        let mes1Saida = {
            mes: 'Janeiro',
            
            valorTotal: valorTotal(janeiroTudo.saidas) ,
            quantidade: quantidade(janeiroTudo.saidas),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(janeiroTudo.saidas)) / (quantidade(janeiroTudo.saidas))).toFixed(0)
        }
        let mes2Saida =  {
            mes: 'Fevereiro',
            valorTotal: valorTotal(fevereiroTudo.saidas),
            quantidade: quantidade(fevereiroTudo.saidas),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(fevereiroTudo.saidas)) / (quantidade(fevereiroTudo.saidas))).toFixed(0)
        }
        let mes3Saida ={
            mes: 'Março',
            valorTotal: valorTotal(marcoTudo.saidas),
            quantidade: quantidade(marcoTudo.saidas),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(marcoTudo.saidas)) / (quantidade(marcoTudo.saidas))).toFixed(0)
        }
        let mes4Saida =  {
            mes: 'Abril',
            valorTotal: valorTotal(abrilTudo.saidas),
            quantidade: quantidade(abrilTudo.saidas),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(abrilTudo.saidas)) / (quantidade(abrilTudo.saidas))).toFixed(0)
        }
        let mes5Saida = {
            mes: 'Maio',
            valorTotal: (valorTotal(maioTudo.saidas)),
            quantidade: quantidade(maioTudo.saidas),
            // tipo: 'Mensalidade',
            valorMedio: ((valorTotal(maioTudo.saidas)) / (quantidade(maioTudo.saidas))).toFixed(0)
        }

        const boletoMeses = {saidas: [], entradas:[] }
        // ? janeiro
        if(janeiroTudo.saidas.length > 0){
           boletoMeses.saidas.push(mes1Saida)
        }
        if(janeiroTudo.entrada.length > 0){
           boletoMeses.entradas.push(mes1Entrada)

        }
        // ? fevereiro
        if(fevereiroTudo.saidas.length > 0){
           boletoMeses.saidas.push(mes2Saida)
        }
        if(fevereiroTudo.entrada.length > 0){
           boletoMeses.entradas.push(mes2Entrada)

        }
        // ? março
        if(marcoTudo.saidas.length > 0){
           boletoMeses.saidas.push(mes3Saida)
        }
        if(marcoTudo.entrada.length > 0){
           boletoMeses.entradas.push(mes3Entrada)

        }
        // ? abril
        if(abrilTudo.saidas.length > 0){
           boletoMeses.saidas.push(mes4Saida)
        }
        if(abrilTudo.entrada.length > 0){
           boletoMeses.entradas.push(mes4Entrada)

        }
        // ? maio
        if(maioTudo.saidas.length > 0){
           boletoMeses.saidas.push(mes5Saida)
        }
        if(maioTudo.entrada.length > 0){
           boletoMeses.entradas.push(mes5Entrada)
        }
       

        let valorMedioEntrada = 0
        let qtdEntrada = 0
        let totalEntrada = 0

        let valorMedioSaida = 0
        let qtdSaida = 0
        let totalSaida = 0

        boletoMeses.entradas.forEach(element => {
            qtdEntrada += element.quantidade
            totalEntrada += element.valorTotal
        });
        boletoMeses.saidas.forEach(element => {
            qtdSaida += element.quantidade
            totalSaida += element.valorTotal
        });

        valorMedioEntrada = (totalEntrada / qtdEntrada).toFixed(0)
        valorMedioSaida = (totalSaida / qtdSaida).toFixed(0)

        context = {boletoMeses, estilo, valorMedioEntrada, valorMedioSaida}
        renderedHtml = nunjucks.render('admin/relatorio/financeiro/completo.njk', context);
    }


          
        //!
        // Crie uma instância do navegador e crie uma nova página
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
         
          // Defina o conteúdo da página como a saída do template Nunjucks renderizado

          await page.setContent(renderedHtml);

          // Aguarda o tempo de espera antes de gerar o PDF
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Gere o PDF a partir da página renderizada
          const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
            width: '209.55mm',
            height: '298.45mm',
            // format: 'A4',
            margin: { top: '20px', left: '20px', right: '20px', bottom: '20px' }
          });
        
         
          // Feche o navegador
          await browser.close();

         // Envie o PDF como resposta ao cliente
           res.contentType('application/pdf');
            res.send(pdf);
        // !
          //  res.send(renderedHtml);
         
    }

    exports.relatorioFuncionario = async (req,res) => {

        res.render('admin/relatorio/relatorio_funcionarios')

    }

    exports.gerarRelatorioFuncionarios = async (req,res) =>{
      let renderedHtml

      let context;
      const {tipo, estilo} = req.body

      if(tipo == 'ativos'){
        const funcionariosAtivos = await Funcionario.find({status: 'Ativo'}).sort({nome: 1})
        const nFuncionarios = await Funcionario.count()
        
        const nFuncionariosAtivos = funcionariosAtivos.length

        context = { funcionariosAtivos,nFuncionariosAtivos,estilo,nFuncionarios}
        renderedHtml = nunjucks.render('admin/relatorio/funcionarios/ativos.njk', context);
      }
      if(tipo == 'inativos'){
        const funcionariosInativos = await Funcionario.find({status: 'Inativo'}).sort({ nome: 1 });
        const nFuncionarios = await Funcionario.count()
        const nFuncionariosInativos = funcionariosInativos.length
        
        context = {funcionariosInativos,nFuncionariosInativos ,nFuncionarios, estilo}
        renderedHtml = nunjucks.render('admin/relatorio/funcionarios/inativos.njk', context);

      }
      if(tipo == 'ativoinativo'){
        const funcionariosAtivos = await Funcionario.find({status: 'Ativo'}).sort({ nome: 1 });

        const funcionariosInativos = await Funcionario.find({status: 'Inativo'}).sort({ nome: 1 });

        const nFuncionarios = await Funcionario.count()
        const nFuncionariosAtivos = funcionariosAtivos.length
        const nFuncionariosInativos = funcionariosInativos.length
        

        context = {funcionariosAtivos, nFuncionarios, nFuncionariosAtivos,funcionariosInativos, nFuncionariosInativos, estilo}
        renderedHtml = nunjucks.render('admin/relatorio/funcionarios/completo.njk', context);

      }


  
        //!
        // Crie uma instância do navegador e crie uma nova página
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
         
          // Defina o conteúdo da página como a saída do template Nunjucks renderizado
          
          await page.setContent(renderedHtml);
          const tempoEspera = 1500;

          // Aguarda o tempo de espera antes de gerar o PDF
          await new Promise(resolve => setTimeout(resolve, tempoEspera));



          // Gere o PDF a partir da página renderizada
          const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
            width: '209.55mm',
            height: '298.45mm',
            // format: 'A4',
            margin: { top: '20px', left: '20px', right: '20px', bottom: '20px' }
            
          });
        
         
          // Feche o navegador
          await browser.close();

         // Envie o PDF como resposta ao cliente
           res.contentType('application/pdf');
          res.send(pdf);
        // !
          //  res.send(renderedHtml);

    }


    exports.relatorioClientes = async (req,res) => {

        res.render('admin/relatorio/relatorio_clientes')

    }

    exports.gerarRelatorioClientes = async (req,res) =>{
      let renderedHtml

      let context;
      const {tipo, estilo} = req.body

      if(tipo == 'ativos'){
        const clientesAtivos = await Cliente.find({status: 'Ativo'}).sort({nome: 1})
        const nClientes = await Cliente.count()
        
        const nClientesAtivos = clientesAtivos.length

        context = { clientesAtivos,nClientesAtivos,estilo,nClientes}
        renderedHtml = nunjucks.render('admin/relatorio/clientes/ativos.njk', context);
      }
      if(tipo == 'inativos'){
        const clientesInativos = await Cliente.find({status: 'Inativo'}).sort({ nome: 1 });
        const nClientes = await Cliente.count()
        const nClientesInativos = clientesInativos.length
        
        context = {clientesInativos,nClientesInativos ,nClientes, estilo}
        renderedHtml = nunjucks.render('admin/relatorio/clientes/inativos.njk', context);

      }
      if(tipo == 'ativoinativo'){
        const clientesAtivos = await Cliente.find({status: 'Ativo'}).sort({ nome: 1 });

        const clientesInativos = await Cliente.find({status: 'Inativo'}).sort({ nome: 1 });

        const nClientes = await Cliente.count()
        const nClientesAtivos = clientesAtivos.length
        const nClientesInativos = clientesInativos.length
        

        context = {clientesAtivos, nClientes, nClientesAtivos,clientesInativos, nClientesInativos, estilo}
        renderedHtml = nunjucks.render('admin/relatorio/clientes/completo.njk', context);

      }


  
        //!
        // Crie uma instância do navegador e crie uma nova página
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
         
          // Defina o conteúdo da página como a saída do template Nunjucks renderizado
          
          await page.setContent(renderedHtml);
          const tempoEspera = 1500;

          // Aguarda o tempo de espera antes de gerar o PDF
          await new Promise(resolve => setTimeout(resolve, tempoEspera));



          // Gere o PDF a partir da página renderizada
          const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
            width: '209.55mm',
            height: '298.45mm',
            // format: 'A4',
            margin: { top: '20px', left: '20px', right: '20px', bottom: '20px' }
            
          });
        
         
          // Feche o navegador
          await browser.close();

         // Envie o PDF como resposta ao cliente
           res.contentType('application/pdf');
          res.send(pdf);
        // !
          // res.send(renderedHtml);

 
    }

