const mongoose = require('mongoose')

const evaluteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'User is require'],
            ref: 'User',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Product is require'],
            ref: 'Product',
        },
        star: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5],
            default: 0,
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true },
)
module.exports = mongoose.model('Evalute', evaluteSchema, 'evalutes')
