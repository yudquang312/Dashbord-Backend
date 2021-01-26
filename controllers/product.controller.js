const Product = require('../models/product.model')
const mongoose = require('mongoose')
class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString = req.query

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach((el) => delete queryObj[el])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(
            /\b(gte|gt|lt|lte|regex)\b/g,
            (match) => '$' + match,
        )
        const data = JSON.parse(queryStr)
        if (data.name) {
            data.name['$options'] = 'i'
        }
        this.query.find(data)

        return this
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 2
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

const productCtl = {
    create: async (req, res, next) => {
        try {
            console.log(req.body)
            const {
                name,
                type,
                images,
                code,
                description,
                colors,
                amount,
                inputPrice,
                salePrice,
                sizes,
                promotion,
                limited,
                style,
                material,
                category,
            } = req.body
            if (
                !name ||
                !type ||
                !images ||
                !code ||
                !description ||
                colors.length === 0 ||
                !amount ||
                !inputPrice ||
                !salePrice ||
                !sizes.length === 0 ||
                !style ||
                !material ||
                !category
            ) {
                console.log('Please fill in all fields.')
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const nameExisted = await Product.findOne({ name })
            if (nameExisted) {
                console.log('This product name already exists .')
                return res.status(400).json({
                    msg: 'This product name already exists .',
                })
            }

            const codeExisted = await Product.findOne({ code })
            if (codeExisted) {
                return res.status(400).json({
                    msg: 'This product code already exists .',
                })
            }
            const total = sizes.reduce((a, b) => a + b.amount, 0)
            if (total !== amount) {
                return res.status(400).json({
                    msg: 'Have error amount',
                })
            }
            const newProduct = new Product({
                name,
                type,
                images,
                code,
                description,
                colors,
                amount,
                inputPrice,
                salePrice,
                sizes,
                promotion,
                limited,
                style,
                createBy: req.body.createBy,
                material,
                category,
            })

            for (let key in newProduct) {
                !newProduct[key] && delete newProduct[key]
            }
            const product = await newProduct.save()
            return res.status(201).json(product)
        } catch (e) {
            console.log(e.message)
            return res.status(500).json({ msg: e.message })
        }
    },
    getAllProduct: async (req, res, next) => {
        try {
            const features = new APIfeatures(
                Product.find({ deletedAt: undefined })
                    .populate({
                        path: 'createBy',
                        select: 'name',
                    })
                    .populate({
                        path: 'type',
                    })
                    .populate({
                        path: 'colors',
                    })
                    .populate({
                        path: 'category',
                    })
                    .populate({
                        path: 'style',
                    })
                    .populate({
                        path: 'material',
                    })
                    .select('-inputPrice -size'),
                req.query,
            )
                .filtering()
                .sorting()
            const total = await features.query
            const products = await features.paginating().query
            return res.status(200).json({
                products,
                query: {
                    total: total.length,
                    limit: req.query.limit || 2,
                    page: req.query.page || 1,
                },
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const id = req.params.id
            const product = await Product.findOne({
                _id: id,
                deletedAt: undefined,
            })
            if (!product) {
                return res.status(400).json({ msg: 'Product not existed' })
            }
            await Product.updateOne(
                { _id: id, deletedAt: undefined },
                { deletedAt: Date.now() },
            )
            return res.status(200).json({ msg: 'Update success' })
        } catch (e) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getProduct: async (req, res, next) => {
        try {
            const id = req.params.id
            const product = await Product.findOne({ _id: id })
                .select('-inputPrice')
                .populate([{ path: 'colors', model: 'Color' }])
                .populate({
                    path: 'createBy',
                    select: 'name',
                })
                .populate({
                    path: 'type',
                })
                .populate({
                    path: 'category',
                })
                .populate({
                    path: 'sizes.sizeId',
                })
                .populate({
                    path: 'style',
                })
                .populate({
                    path: 'material',
                })
                .exec()
            if (!product) {
                return res.status(400).json({ msg: 'Product not found' })
            }
            return res.status(200).json(product)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id
            const product = await Product.findOne({ _id: id })

            if (!product) {
                return res.status(400).json({ msg: 'Product not found' })
            }
            const {
                name,
                type,
                images,
                code,
                description,
                colors,
                amount,
                inputPrice,
                salePrice,
                sizes,
                sold,
                promotion,
                limited,
                style,
                material,
                category,
            } = req.body
            const data = {
                name,
                type,
                images,
                code,
                description,
                colors,
                amount,
                inputPrice,
                salePrice,
                sizes,
                promotion,
                limited,
                style,
                material,
                sold,
                category,
            }

            for (let key in data) {
                if (Array.isArray(data[key])) {
                    if (data[key].length === 0) {
                        delete data[key]
                    }
                } else {
                    if (!data[key]) delete data[key]
                }
            }
            // console.log(data)
            await Product.findOneAndUpdate({ _id: id }, { $set: data })
            return res.status(200).json({ msg: 'Update success' })
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },

    decreaseAmount: async (req, res, next) => {
        try {
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
                    return res.status(400).json({ msg: err.message })
                } else {
                    // return res.status(200).json(products)
                    next()
                }
            })
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
    creaseAmount: async (req, res, next) => {
        try {
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
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json(products)
                }
            })
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
}

module.exports = productCtl
