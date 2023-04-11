const Cliente = require('./models/clienteModel') // model de teste

const express = require('express')
const mongoose = require('mongoose')
const { required } = require('nodemon/lib/config')
const {body, validationResult} = require('express-validator')
const bodyParser = require('body-parser')
const app = express()

// create with validation
app.post('/cliente/cadastro',[
    body('name').notEmpty(),
    body('dataNascimento').isDate(),
    body('email').isEmail(),
    body('senha').isLength({min: 5})
], async(req,res) =>{

    const errors = validationResult(req)
    try {

        const cliente = await Cliente.create(req.body)

        res.status(200).send('Cadastro realizado')
        
        // console.log(req.body);

    } catch (e) {
        if(!errors.isEmpty()){
            res.status(500).json({errors: errors.array()})
        }
        // console.log(req.body);
        console.log(e.message);
        res.status(500).json({message: e.message})
    }
})

// create without validation
// app.post('/cliente/cadastro', async(req,res) =>{
//     try {

//         const cliente = await Cliente.create(req.body)

//         res.status(200).send('Cadastro realizado')
        
//         // console.log(req.body);

//     } catch (e) {
//         // console.log(req.body);
//         console.log(e.message);
//         res.status(500).json({message: e.message})
//     }
// })





