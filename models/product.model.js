const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'Please enter product name'],
        },
        type: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Please choose type product'],
            ref: 'TypeProduct',
        },
        images: [
            {
                type: String,
                required: [true, 'Please upload images'],
            },
        ],
        code: {
            type: String,
            unique: true,
            required: [true, 'Please code product'],
        },
        description: {
            type: String,
            required: true,
        },
        colors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Color',
                required: true,
            },
        ],
        amount: {
            type: Number,
            min: 0,
            required: [true, 'Please enter amount'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        sold: {
            type: Number,
            min: 0,
            default: 0,
        },
        inputPrice: {
            type: Number,
            min: 0,
            required: [true, 'Please enter input price'],
        },
        salePrice: {
            type: Number,
            min: 0,
            required: [true, 'Please enter sale price'],
        },
        sizes: [
            {
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
        ],
        promotion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Promotion',
        },

        limited: {
            type: Boolean,
            default: false,
        },
        style: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Style',
            required: true,
        },
        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material',
            required: true,
        },
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Product', productSchema, 'Products')
