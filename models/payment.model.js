const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        typePayment: {
            type: Number,
            enum: [0, 1],
            default: 0,
        },
        status: {
            type: Number,
            enum: [0, 1],
            default: 0,
        },
        datePayment: {
            type: Date,
        },
        vnp: {
            vnp_Amount: { type: Number },
            vnp_CardType: { type: String },
            vnp_BankCode: { type: String },
            vnp_TmnCode: { type: String },
            vnp_BankTranNo: { type: String },
            vnp_PayDate: { type: String },
            vnp_ResponseCode: { type: String },
            vnp_TransactionNo: { type: String },
            vnp_TransactionStatus: { type: String },
            vnp_TxnRef: { type: String },
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Payment', paymentSchema, 'payments')
