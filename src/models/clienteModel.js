const { default: mongoose } = require('mongoose')
const moongose = require('mongoose')

const clienteSchema = moongose.Schema(
    {
        name: {
            type: String,
            required: [true, "nome é obrigatorio"]
        },
        dataNascimento: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        senha: {
            type: String,
            required: true
        },
        
    },
    {
        timestamps: true
    }
)

const Cliente = mongoose.model('Cliente', clienteSchema)

module.exports = Cliente