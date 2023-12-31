require('dotenv').config()
const express = require('express');
const { flash } = require('express-flash-message')
const session = require('express-session')
const methodOverride =require('method-override')
const nunjucks = require('nunjucks')
const app = express();
const connectDB = require('./server/config/db')
const port = 1212


// ! autenticação
const autenticacaoMiddleware = require('./server/middleware/auth');

// session (cookies)
app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1week
      }
    })
  )
  
// flash messages
app.use(flash({sessionKeyName: 'flashmessage'}))
// methodOverride
app.use(methodOverride('_method'))


app.use(express.json()) // accept json as data
app.use(express.urlencoded({extended: false })) // accept other things and not only json


// template engine configs
app.set('view engine', 'njk');
// setup static files
app.use(express.static(__dirname + '/public'));
// nunjucks
nunjucks.configure(['./views', './views/', './views/template'] ,{
    autoescape: true,
    express: app,
    noCache: true
});


// db
connectDB()

app.get('/', (req,res) => {
    res.redirect('/login')
})

// ? login routes
app.use(require('./server/routes/login.routes'));

// ? dashboard
app.use( autenticacaoMiddleware, require('./server/routes/dashboard.routes'));

// ? portal
app.use(autenticacaoMiddleware, require('./server/routes/portal.routes'));

// ? atendente
app.use( autenticacaoMiddleware, require('./server/routes/acadmin.routes'));


// pagina de erro

app.get('*', (req, res) => {
  res.status(404).render('errors/404');
});

app.listen(port, () =>{
    console.log(`server on at ${port}`);
  })
  