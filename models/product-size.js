const mongoose = require('mongoose')

const productSizeSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        sizeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Size',
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Please enter amount'],
        },
        sold: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model(
    'ProductSize',
    productSizeSchema,
    'product_sizes',
)
