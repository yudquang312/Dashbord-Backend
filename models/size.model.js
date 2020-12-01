const mongoose = require('mongoose')

const sizeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter size name '],
            unique: true,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Size', sizeSchema, 'sizes')
