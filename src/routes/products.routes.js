const Product = require('./models/productModel') // model de teste

const express = require('express')
const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator')
const bodyParser = require('body-parser')
const app = express()


// read all products
app.get('/products', async(req,res) => {
    try {
        const products = await Product.find({})

        res.status(200).json(products)
    } catch (e) {
        console.log(e.message);
        res.status(500).json({message: e.message})
    }
})

// read by id
app.get('/products/:id', async(req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)

        res.status(200).json(product)
    } catch (e) {
        console.log(e.message);
        res.status(500).json({message: e.message})
    }
})

// create
app.post('/products', async (req,res) => {
    try {
        const product = await Product.create(req.body)

        res.status(200).json(product)


    } catch (e) {
        console.log(e.message);
        res.status(500).json({message: e.message})
    }

})

// update by id
app.put('/products/:id', async (req,res) => {
    try {
        const {id} = req.params

        const product = await Product.findByIdAndUpdate(id, req.body) // 2 parameters, the id and the data that we want to update

        // we can not find any product with this id
        if(!product){
            res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updated = await Product.findById(id)
        res.status(200).json(updated)

    } catch (e) {
        res.status(500).json({message: e.message})
    }
})


// delete by id

app.delete('/products/:id', async (req,res) =>{
    try {

        const {id} = req.params
        const product = await Product.findByIdAndDelete(id) 

        if(!product){
            res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        res.status(200).json(product)
        
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

