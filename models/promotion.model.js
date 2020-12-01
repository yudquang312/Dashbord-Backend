const mongoose = require('mongoose')

const promotionSchemna = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        dateBegin: {
            type: Date,
        },
        dateEnd: {
            type: Date,
        },
        type: {
            type: String,
            enum: ['product', 'order'],
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        percent: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Promotion', promotionSchemna, 'promotions')
