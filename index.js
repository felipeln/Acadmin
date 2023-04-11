const express = require('express');
const app = express();
const nunjucks = require('nunjucks')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json()) // accetp json as data
app.use(express.urlencoded({extended: false })) // accept other things and not only json
app.use(bodyParser.json())


// template engine configs
app.set('view engine', 'njk');
// setup css file
// app.use(express.static('/public'))
app.use(express.static(__dirname + '/public'));

nunjucks.configure('./src/views', {
    autoescape: true,
    express: app,
    noCache: true
});



// Mongo DB conncetiony
const database = process.env.MONGOLAB_URI;

mongoose.set('strictQuery', false)

mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true })
.then(() =>{
    console.log('connected to mongodb');

    app.listen(1212,() =>{
        console.log('server is running');
    })
    

}).catch((e) =>{
  console.log(e);
})




// basic routes

app.get('/', (req,res) => {
    res.send('working')
})
// login
app.get('/login', async(req,res) =>{
    res.render('login')
})
// esqueci a senha
app.get('/esqueci_senha', async(req,res) =>{
    res.render('esqueci_senha')
})
// rota para onde vai o email para resetar a senha
app.get('/reset_senha', async(req,res) =>{
    res.render('esqueci_senha')
})


// dashboard
app.get('/dashboard', async(req,res) =>{
    res.render('dashboard')
})
app.get('/dashboard#login', async(req,res) =>{
    res.redirect('/dashboard')
})

// dashboard cadastro
app.get('/dashboard/cadastro', async(req,res) =>{
    res.render('cadastro')
})
// dashboard agendamento
app.get('/dashboard/agendamento', async(req,res) =>{
    const data = {
        title: "agendamento"
    }
    res.render('agendamento')
})
// dashboard gerenciamento
app.get('/dashboard/gerenciamento', async(req,res) =>{
    res.render('gerenciamento')
})
// dashboard financeiro
app.get('/dashboard/financeiro', async(req,res) =>{
    res.render('financeiro')
})
// dashboard relatorios
app.get('/dashboard/relatorios', async(req,res) =>{
    res.render('relatorios')
})