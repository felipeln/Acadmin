const mongoose = require('mongoose')
const Admin = require('../models/Admin')
mongoose.set('strictQuery', false)

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)

        const adminUser = await Admin.findOne({nome: 'admin'})

        if(!adminUser){
            const defaultAdmin = new Admin({
                nome: 'admin',
                sobrenome: 'admin',
                email: 'admin',
                senha: 'admin',
            })

            await defaultAdmin.save()
            
        }

        console.log("db is up" + `${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}


module.exports = connectDB
