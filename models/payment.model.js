const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        status: {
            type: Number,
            enum: [0, 1],
            default: 0,
        },

        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Payment', paymentSchema, 'payments')
