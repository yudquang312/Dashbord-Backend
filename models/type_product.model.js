const mongoose = require('mongoose')

const typeProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter type product name'],
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('TypeProduct', typeProductSchema, 'typeProduct')
