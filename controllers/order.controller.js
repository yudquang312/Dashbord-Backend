const Order = require('../models/order.model')

const orderCtl = {
    create: async (req, res, next) => {
        try {
            const { promotion, products, address, shipMoney, total } = req.body

            if (products.length === 0 || !address || !shipMoney || !total) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }

            const isTrue = total === products.reduce((a, b) => a + b.total, 0)

            if (!isTrue) {
                return res.status(400).json({
                    msg: 'Have error. Please do it again',
                })
            }
            const data = {
                promotion,
                products,
                address,
                shipMoney,
                total,
                user: req.user._id,
            }

            if (!promotion) delete data['promotion']

            const newOrder = new Order(data)

            await newOrder.save()

            return res.status.json({
                msg: 'Create order success',
            })
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id
            const order = await Order.findOne({ _id: id })

            if (!order) {
                return res.status(400).json({ msg: 'Order not found' })
            }
            const { receivedDate, deliveryDate, status } = req.body
            const data = {
                receivedDate,
                deliveryDate,
                status,
            }

            for (let key in data) {
                if (!data[key]) delete data[key]
            }

            if (Object.keys(data).length === 0) {
                return res.status(400).json({
                    msg: 'No field to update',
                })
            }

            await Order.updateOne({ _id: id }, data)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    getOrder: async (req, res, next) => {
        try {
            const { id } = req.params

            const order = await Order.findOne({ _id: id, deteledAt: undefined })
                .lean()
                .populate({
                    path: 'user',
                })
                .populate({
                    path: 'promotion',
                })
                .populate({
                    path: 'product.productId',
                })

            if (!order) {
                return res.status(400).json({
                    msg: 'Order not found',
                })
            }

            return res.status(200).json(order)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
    getOrderByUser: async (req, res, next) => {
        try {
            const { id } = req.params

            const order = await Order.findOne({
                _id: id,
                deteledAt: undefined,
                user: req.user._id,
            })
                .lean()
                .populate({
                    path: 'user',
                })
                .populate({
                    path: 'promotion',
                })
                .populate({
                    path: 'product.productId',
                })

            if (!order) {
                return res.status(400).json({
                    msg: 'Order not found',
                })
            }

            return res.status(200).json(order)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    getAllOrder: async (req, res, next) => {
        try {
            const orders = await Order.find({ deteledAt: undefined })
                .lean()
                .populate({
                    path: 'user',
                })
                .populate({
                    path: 'promotion',
                })
                .populate({
                    path: 'product.productId',
                    select: 'name',
                })

            return res.status(200).json(orders)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    getAllOrderByUser: async (req, res, next) => {
        try {
            const orders = await Order.find({
                deteledAt: undefined,
                user: req.user._id,
            })
                .lean()
                .populate({
                    path: 'user',
                })
                .populate({
                    path: 'promotion',
                })
                .populate({
                    path: 'product.productId',
                    select: 'name',
                })

            return res.status(200).json(orders)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    detele: async (req, res, next) => {
        try {
            const { id } = req.params

            const order = Order.findOne({ _id: id, deteledAt: undefined })

            if (!order) {
                return res.status(400).json({
                    msg: 'Order not found',
                })
            }

            await Order.updateOne(
                { _id: id, deteledAt: undefined },
                { deteledAt: Date.now() },
            )

            return res.status(200).json({
                msg: 'Delete success',
            })
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
}

module.exports = orderCtl
