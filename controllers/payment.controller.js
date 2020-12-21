const Payment = require('../models/payment.model')
const dateformat = require('dateformat')
const querystring = require('qs')
const Order = require('../models/order.model')
const sha256 = require('sha256')
const paymentCtl = {
    create_payment_url: async (req, res, next) => {
        try {
            const {
                promotion,
                products,
                address,
                shipMoney,
                note,
                typePayment,
            } = req.body

            if (!products || products.length === 0 || !address || !shipMoney) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }

            const total = products.reduce((a, b) => a + b.price * b.amount, 0)

            const data = {
                promotion,
                products,
                address,
                shipMoney,
                intoMoney: total,
                total: total + shipMoney,
                user: req.user.id,
                note: note ? note : '',
                typePayment: typePayment ? typePayment : 0,
            }

            if (!promotion) delete data['promotion']

            const order = new Order(data)
            // await order.save()
            var ipAddr =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress

            let vnp_Params = {
                vnp_Version: 2,
                vnp_Command: 'pay',
                vnp_TmnCode: process.env.VNP_TMNCODE,
                vnp_Amount: total * 100,
                vnp_Locale: 'vn',
                vnp_CurrCode: 'VND',
                vnp_TxnRef: `${order._id}`,
                vnp_OrderInfo: `DINO Shope payment for order ${order._id}, cost: ${total} VND`,
                vnp_OrderType: 'fashion',
                vnp_IpAddr: ipAddr,
                vnp_BankCode: 'NCB',
                vnp_CreateDate: dateformat(new Date(), 'yyyymmddHHmmss'),
                vnp_ReturnUrl: process.env.VNP_RETURNURL,
            }

            vnp_Params = sortObject(vnp_Params)

            var signData =
                process.env.VNP_HASHSCERET +
                querystring.stringify(vnp_Params, { encode: false })

            var secureHash = sha256(signData)

            vnp_Params['vnp_SecureHashType'] = 'SHA256'

            vnp_Params['vnp_SecureHash'] = secureHash

            const vnpUrl =
                process.env.VNP_URL +
                '?' +
                querystring.stringify(vnp_Params, { encode: true })
            res.cookie('order', JSON.stringify(order), {
                httpOnly: false,
                maxAge: 10 * 60 * 1000,
            })
            return res.status(200).json({ code: '00', url: vnpUrl })
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    payment_return: async (req, res, next) => {
        try {
            const { vnpay } = req.body
            const order = JSON.parse(req.cookies.order)
            order.vnpay = vnpay
            if (vnpay.responseCode == '00') {
                order.save()
                let query = order.products.map((item) => {
                    return {
                        updateOne: {
                            filter: {
                                _id: item.productId,
                                'sizes.sizeId': item.sizeId,
                            },
                            update: {
                                $inc: {
                                    'sizes.$.amount': -item.amount,
                                    'sizes.$.sold': +item.amount,
                                    amount: -item.amount,
                                    sold: +item.amount,
                                },
                            },
                        },
                    }
                })
                await Product.bulkWrite(query, {})
                res.clearCookie('refresh_token')
                return res.status(200).json(order)
            } else {
                res.clearCookie('refresh_token')
                return res.status(400).json({ msg: 'Created order fail' })
            }
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
}

function sortObject(o) {
    var sorted = {},
        key,
        a = []

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key)
        }
    }

    a.sort()

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]]
    }
    return sorted
}
module.exports = paymentCtl
