const moongose = require('mongoose')


const productSchema = moongose.Schema(
    {
        name: {
            type: String,
            required: [true, "please enter a product name"]
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)


const Product = moongose.model('Product', productSchema)


module.exports = Product