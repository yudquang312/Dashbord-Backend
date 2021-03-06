const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'User is require'],
            ref: 'User',
        },
        recipientName: {
            type: String,
            minlength: 3,
            required: [true, "Recipient's name is require"],
        },
        recipientPhone: {
            type: String,
            length: 10,
            required: [true, "Recipient's phone is require"],
        },
        dateOrder: {
            type: Date,
            default: Date.now(),
        },
        status: {
            type: Number,
            enum: [-1, 0, 1, 2], // 0: đang chờ lấy hàng, 1: đang giao, 2: Đã giao
            default: -1,
        },
        confirm: {
            type: Number,
            enum: [-1, 0, 1],
            default: 0,
        },
        expectedDate: {
            type: Date,
            // default: Date.now() + 7 * 24 * 60 * 60 * 1000,
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
        intoMoney: {
            type: Number,
            required: [true, 'Into money is required'],
            min: 0,
        },
        total: {
            type: Number,
            required: [true, 'Total money is required'],
            min: 0,
        },
        typePayment: {
            type: Number,
            enum: [0, 1],
            default: 0,
        },
        vnpay: {
            amount: { type: Number },
            cardType: { type: String },
            bankCode: { type: String },
            tmnCode: { type: String },
            bankTranNo: { type: String },
            payDate: { type: String },
            responseCode: { type: String },
            transactionNo: { type: String },
            transactionStatus: { type: String },
            txnRef: { type: String },
        },
        note: {
            type: String,
            maxLength: 200,
            default: '',
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
