const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGOLAB_URI;


// mongoose.set('useNewUrlParser', true)
// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)
// mongoose.set('useUnifiedTopology', true)

mongoose
    .connect(uri)
    .then(() =>{
        console.log('db is up');
        })
    .catch(() => {
        
})

