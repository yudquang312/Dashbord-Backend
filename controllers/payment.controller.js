const Payment = require('../models/payment.model')
const dateformat = require('dateformat')
const querystring = require('qs')
const Order = require('../models/order.model')
const paymentCtl = {
    create_payment_url: async (req, res, next) => {
        try {
            // const {
            //     promotion,
            //     products,
            //     address,
            //     shipMoney,
            //     note,
            //     typePayment,
            // } = req.body

            // if (!products || products.length === 0 || !address || !shipMoney) {
            //     return res.status(400).json({
            //         msg: 'Please fill in all fields.',
            //     })
            // }

            // const total = products.reduce((a, b) => a + b.price * b.amount, 0)
            // let payment = {}
            // if (typePayment > 0) {
            //     payment.typePayment = typePayment
            //     payment.status = 1
            // }
            // const data = {
            //     promotion,
            //     products,
            //     address,
            //     shipMoney,
            //     intoMoney: total,
            //     total: total + shipMoney,
            //     user: req.user.id,
            //     note: note ? note : '',
            //     // payment,
            // }

            // if (!promotion) delete data['promotion']

            // const order = new Order(data)
            const total = +req.body.total
            var ipAddr =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress

            var tmnCode = process.env.vnp_TmnCode
            var secretKey = process.env.vnp_HashSecret
            var vnpUrl = process.env.vnp_Url
            var returnUrl = process.env.vnp_ReturnUrl

            var date = new Date()

            var createDate = dateformat(date, 'yyyymmddHHmmss')
            var orderId = dateformat(date, 'HHmmss')
            var amount = req.body.amount
            var bankCode = req.body.bankCode

            let vnp_Params = {
                vnp_Version: 2,
                vnp_Command: 'pay',
                vnp_TmnCode: 'ASVNPAYM',
                vnp_Amount: 10000 * 100,
                vnp_Locale: 'vn',
                vnp_CurrCode: 'VND',
                vnp_TxnRef: dateformat(new Date(), 'HHmmss'),
                vnp_OrderInfo: 'adasads',
                vnp_OrderType: 'fashion',
                vnp_IpAddr: ipAddr,
                vnp_BankCode: 'NCB',
                vnp_CreateDate: dateformat(new Date(), 'yyyymmddHHmmss'),
                vnp_ReturnUrl: 'http://localhost:3000/product-detail/123',
            }
            // var orderInfo = req.body.orderDescription
            // var orderType = req.body.orderType
            // var locale = req.body.language
            // if (locale === null || locale === '') {
            //     locale = 'vn'
            // }
            // var currCode = 'VND'
            // var vnp_Params = {}
            // vnp_Params['vnp_Version'] = 2
            // vnp_Params['vnp_Command'] = 'pay'
            // vnp_Params['vnp_TmnCode'] = tmnCode
            // // vnp_Params['vnp_Merchant'] = ''
            // vnp_Params['vnp_Locale'] = locale
            // vnp_Params['vnp_CurrCode'] = currCode
            // vnp_Params['vnp_TxnRef'] = orderId
            // vnp_Params['vnp_OrderInfo'] = JSON.stringify({ orderID: 'thaolv' })
            // vnp_Params['vnp_OrderType'] = 'fashion'
            // vnp_Params['vnp_Amount'] = total * 100
            // vnp_Params['vnp_ReturnUrl'] = returnUrl
            // vnp_Params['vnp_IpAddr'] = ipAddr
            // vnp_Params['vnp_CreateDate'] = createDate
            // if (bankCode !== null && bankCode !== '') {
            //     vnp_Params['vnp_BankCode'] = 'NCB'
            // }

            vnp_Params = sortObject(vnp_Params)

            var signData =
                secretKey + querystring.stringify(vnp_Params, { encode: false })

            var sha256 = require('sha256')

            var secureHash = sha256(signData)

            vnp_Params['vnp_SecureHashType'] = 'SHA256'
            vnp_Params['vnp_SecureHash'] = secureHash
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true })
            console.log(vnpUrl)
            return res.status(200).json({ code: '00', data: vnpUrl })
            // return res.redirect(vnpUrl)
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
