const Order = require('../models/order.model')
const Product = require('../models/product.model')
const APIfeatures = require('../helper/filter')

const orderCtl = {
    checkOrder: async (req, res, next) => {
        try {
            const products = req.body.products
            const query = products.map((pd) => ({
                _id: pd.productId,
                'sizes.sizeId': pd.sizeId,
            }))

            const getProducts = await Product.find({ $or: query })
                .sort({
                    _id: 1,
                })
                .select('name amount sizes')
                .populate({
                    path: 'sizes.sizeId',
                })

            if (getProducts.length !== products.length) {
                return res.status(400).json({
                    msg: 'Have product is not valid',
                })
            }

            products.sort((a, b) => a.productId - b.productId)
            for (let i = 0; i < products.length; i++) {
                const find = getProducts[i].sizes.find((el) => {
                    return el.sizeId._id + '' == products[i].sizeId + ''
                })
                if (getProducts[i].amount === 0 || find.amount === 0) {
                    return res.status(400).json({
                        msg: `Product ${getProducts[i].name} with size ${find.sizeId.name} out of stock`,
                    })
                }
                if (
                    products[i].amount > getProducts[i].amount ||
                    products[i].amount > find.amount
                ) {
                    return res.status(400).json({
                        msg: `The number of ordered products ${getProducts[i].name} with size ${find.sizeId.name} is greater than the quantity of the stock`,
                    })
                }
            }

            next()
        } catch (e) {
            return res.status(400).json({ msg: e.message })
        }
    },
    create: async (req, res, next) => {
        try {
            const {
                promotion,
                products,
                address,
                shipMoney,
                note,
                typePayment,
                recipientName,
                recipientPhone,
            } = req.body

            if (
                !products ||
                products.length === 0 ||
                !address ||
                !shipMoney ||
                !recipientName ||
                !recipientPhone
            ) {
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
                recipientName,
                recipientPhone,
            }

            if (!promotion) delete data['promotion']

            const newOrder = new Order(data)

            await newOrder.save()

            return res.status(200).json({
                msg: 'Create order success',
            })
        } catch (e) {
            let query = req.body.products.map((item) => {
                return {
                    updateOne: {
                        filter: {
                            _id: item.productId,
                            'sizes.sizeId': item.sizeId,
                        },
                        update: {
                            $inc: {
                                'sizes.$.amount': +item.amount,
                                'sizes.$.sold': -item.amount,
                                amount: +item.amount,
                                sold: -item.amount,
                            },
                        },
                    },
                }
            })
            Product.bulkWrite(query, {}, (err, products) => {
                if (err) {
                    return res.status(500).json({ msg: e.message })
                } else {
                    return res.status(500).json({ msg: e.message })
                }
            })
        }
    },

    cancel_confirmOrderByAdmin: async (req, res, next) => {
        try {
            const id = req.params.id
            const { confirm } = req.body
            if (confirm > 1 || confirm < -1) {
                return res.status(400).json({
                    msg: 'Can not confirm order',
                })
            }
            const order = await Order.findOne({ _id: id })

            if (!order) {
                return res.status(400).json({ msg: 'Order not found' })
            }
            if (order.status > 0) {
                return res.status(400).json({
                    msg: `Don\'t ${confirm > 0 ? 'confirm' : 'cancel'} order.`,
                })
            }
            const data = {
                confirm: confirm,
                status: confirm > 0 ? 0 : -1,
            }

            if (order.status === data.status) {
                return res.status(400).json({ msg: "Don't field update" })
            }
            if (confirm < 0) {
                let query = order.products.map((item) => {
                    return {
                        updateOne: {
                            filter: {
                                _id: item.productId,
                                'sizes.sizeId': item.sizeId,
                            },
                            update: {
                                $inc: {
                                    'sizes.$.amount': +item.amount,
                                    'sizes.$.sold': -item.amount,
                                    amount: +item.amount,
                                    sold: -item.amount,
                                },
                            },
                        },
                    }
                })
                Product.bulkWrite(query, {}, (err, products) => {
                    if (err) {
                        return res.status(400).json({
                            msg: 'Have error, Please try again',
                            error: err.message,
                        })
                    }
                })
            }

            await Order.updateOne({ _id: id }, data)

            return res.status(200).json({ msg: 'Confirm order success' })
        } catch (e) {
            if (req.body.confirm < 0) {
                let query = req.body.products.map((item) => {
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
                Product.bulkWrite(query, {}, (err, products) => {
                    if (err) {
                        return res.status(400).json({
                            msg: 'Comfirm order failed',
                            error: err.message,
                        })
                    }
                })
            }
            return res
                .status(500)
                .json({ msg: 'Comfirm order failed', error: e.message })
        }
    },
    cancelOrderByUser: async (req, res, next) => {
        try {
            const id = req.params.id
            const order = await Order.findOne({ _id: id, user: req.user.id })

            if (!order) {
                return res.status(400).json({ msg: 'Order not found' })
            }
            if (order.status >= 0 && order.confirm === 1) {
                return res.status(400).json({
                    msg:
                        'You cannot cancel your order once the order has been confirmed from shop',
                })
            }
            if (order.status < 0 && order.confirm === -1) {
                return res
                    .status(400)
                    .json({ msg: 'Order has been canceled before' })
            }
            let query = order.products.map((item) => {
                return {
                    updateOne: {
                        filter: {
                            _id: item.productId,
                            'sizes.sizeId': item.sizeId,
                        },
                        update: {
                            $inc: {
                                'sizes.$.amount': +item.amount,
                                'sizes.$.sold': -item.amount,
                                amount: +item.amount,
                                sold: -item.amount,
                            },
                        },
                    },
                }
            })
            Product.bulkWrite(query, {}, (err, products) => {
                if (err) {
                    return res.status(400).json({
                        msg: 'Have error, Please try again',
                        error: err.message,
                    })
                }
            })

            await Order.updateOne({ _id: id }, { confirm: -1, status: -1 })

            return res.status(200).json({ msg: 'Cancel order success' })
        } catch (e) {
            let query = order.products.map((item) => {
                return {
                    updateOne: {
                        filter: {
                            _id: item.productId,
                            'sizes.sizeId': item.sizeId,
                        },
                        update: {
                            $inc: {
                                'sizes.$.amount': +item.amount,
                                'sizes.$.sold': -item.amount,
                                amount: +item.amount,
                                sold: -item.amount,
                            },
                        },
                    },
                }
            })
            Product.bulkWrite(query, {}, (err, products) => {
                if (err) {
                    return res.status(400).json({
                        msg: 'Cancel order failed',
                        error: err.message,
                    })
                }
            })
            return res
                .status(500)
                .json({ msg: 'Cancel order failed', error: e.message })
        }
    },
    updateStatusByAdmin: async (req, res, next) => {
        try {
            const id = req.params.id
            const order = await Order.findOne({ _id: id, deletedAt: undefined })
            if (!order) {
                return res.status(400).json({ msg: 'Order not found' })
            }
            const { status } = req.body
            if (status > 2 || status < -1) {
                return res.json({
                    msg: 'Status is not valid',
                })
            }
            if (order.confirm <= 0) {
                return res.json({
                    msg:
                        'The order has not been confirmed, so it cannot be updated',
                })
            }
            if (order.status >= status) {
                return res.json({
                    msg:
                        'Update status failed, status update must be greater current',
                })
            }
            if (status - order.status !== 1) {
                return res.json({
                    msg: 'The status must be continuous with each other',
                })
            }

            let data = {
                status,
            }

            if (status === 1) {
                data.deliveryDate = new Date()
                data.expectedDate = new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000,
                )
            }
            if (status === 2) {
                data.receivedDate = new Date()
            }

            if (Object.keys(data).length === 0) {
                return res.status(400).json({
                    msg: 'No field to update',
                })
            }

            await Order.updateOne({ _id: id }, data)

            return res.status(200).json({ msg: 'Update status success' })
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    getOrder: async (req, res, next) => {
        try {
            const { id } = req.params

            const order = await Order.findOne({ _id: id, deletedAt: undefined })
                .lean()
                .populate({
                    path: 'user',
                })
                .populate({
                    path: 'promotion',
                })
                .populate({
                    path: 'products.productId',
                    select: '-inputPrice -sizes -sold',
                })
                .populate({
                    path: 'products.sizeId',
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
                deletedAt: undefined,
                user: req.user.id,
            })
                .lean()
                .populate({
                    path: 'user',
                    select: '-password',
                })
                .populate({
                    path: 'promotion',
                })
                .populate({
                    path: 'products.productId',
                    select: '-inputPrice -sizes',
                })
                .populate({
                    path: 'products.sizeId',
                })
                .sort({ createdAt: -1 })

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
            const features = new APIfeatures(
                Order.find({ deletedAt: undefined })
                    .populate({
                        path: 'user',
                    })
                    .populate({
                        path: 'promotion',
                    })
                    .populate({
                        path: 'products.productId',
                    })
                    .populate({
                        path: 'products.sizeId',
                    }),
                req.query,
            )
                .filtering()
                .sorting()
                .paginating()

            const orders = await features.query

            return res.status(200).json(orders)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    getAllOrderByUser: async (req, res, next) => {
        try {
            const orders = await Order.find({
                deletedAt: undefined,
                user: req.user.id,
            })
                .populate({
                    path: 'user',
                })
                .populate({
                    path: 'promotion',
                })
                .populate({
                    path: 'products.productId',
                    select: '-inputPrice -sizes -sold',
                })
                .populate({
                    path: 'products.sizeId',
                })
            return res.status(200).json(orders)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    detele: async (req, res, next) => {
        try {
            const { id } = req.params

            const order = await Order.findOne({ _id: id, deletedAt: undefined })

            if (!order) {
                return res.status(400).json({
                    msg: 'Order not found',
                })
            }

            await Order.findOneAndUpdate(
                { _id: id, deletedAt: undefined },
                { $set: { deletedAt: new Date() } },
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
