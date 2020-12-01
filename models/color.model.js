const mongoose = require('mongoose')

const colorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter color name '],
        },
        code: {
            type: String,
            required: [true, 'Please enter color code '],
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Color', colorSchema, 'colors')
