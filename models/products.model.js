const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        product_id: {
            type: String,
            unique: true,
            trim: true,
            require: true,
        },
        title: {
            type: String,
            trim: true,
            required: true,
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        images: {
            type: Object,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category',
        },
        checked: {
            type: Boolean,
            default: false,
        },
        sold: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Product', productSchema, 'products')
