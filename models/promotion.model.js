const mongoose = require('mongoose')

const promotionSchemna = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is require'],
        },
        description: {
            type: String,
            required: [true, 'Description is require'],
        },
        dateBegin: {
            type: Date,
            required: [true, 'Date begin is require'],
        },
        dateEnd: {
            type: Date,
            required: [true, 'Date end is require'],
        },
        // type: {
        //     type: String,
        //     enum: ['product', 'order'],
        //     required: true,
        // },
        code: {
            type: String,
            required: [true, 'Code begin is require'],
            unique: true,
        },
        percent: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, 'Percent begin is require'],
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Promotion', promotionSchemna, 'promotions')
