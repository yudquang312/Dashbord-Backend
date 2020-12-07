const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'User is require'],
            ref: 'User',
        },
        dateOrder: {
            type: Date,
            default: Date.now(),
        },
        status: {
            type: Number,
            enum: [0, 1, 2], // 0: đang chờ xử lý, 1: đang giao, 2: Đã giao
            default: 0,
        },
        expectedDate: {
            type: Date,
            default: Date.now() + 7 * 24 * 60 * 60 * 1000,
        },
        receivedDate: {
            type: Date,
        },
        deliveryDate: {
            type: Date,
        },
        promotion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Promotion',
        },
        VAT: {
            type: Number,
            default: 0,
            min: 0,
        },
        products: [
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
                    required: [true, 'Amount is require'],
                    min: 1,
                },
                price: {
                    type: Number,
                    required: [true, 'Price is require'],
                    min: 0,
                },
                total: {
                    type: Number,
                    required: [true, 'Total is require'],
                    min: 0,
                },
            },
        ],
        address: {
            type: String,
            required: [true, 'Please type address'],
        },
        shipMoney: {
            type: Number,
            required: [true, 'Have not ship money'],
            min: 0,
        },
        total: {
            type: Number,
            required: [true, 'Total money is required'],
            min: 0,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Order', orderSchema, 'orders')
