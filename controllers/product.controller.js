const Product = require('../models/products.model')

// Filter, sorting and paginating

class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filtering() {
        const queryObj = { ...this.queryString } // queryString = req.query

        const excludedFields = ['page', 'sort', 'limit']

        excludedFields.forEach((el) => delete queryObj[el])

        let queryStr = JSON.stringify(queryStr)

        queryStr = queryStr.replace(
            /\b(gte|gt|lt|lte|regex)\b/g,
            (match) => '$' + match,
        )

        //    gte = greater than or equal
        //    lte = lesser than or equal
        //    lt = lesser than
        //    gt = greater than
        this.query.find(JSON.parse(queryStr))

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
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

const productCtl = {
    createProduct: async (req, res, next) => {
        try {
            const { user, body } = req
            const {
                product_id,
                title,
                price,
                description,
                content,
                images,
                category,
            } = body
            if (!images) {
                return res.status(400).json({ msg: 'No image upload' })
            }
            const product = await Product.findOne({ product_id })
            if (product) {
                return res
                    .status(400)
                    .json({ msg: 'This product already exists.' })
            }

            const newProduct = new Product({
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category,
                createdBy: user.id,
            })

            await newProduct.save()

            res.json({
                msg: 'Created a product',
            })
        } catch (e) {
            return res.status(500).json({
                msg: e.message,
            })
        }
    },
    getProducts: async (req, res, next) => {
        try {
            const features = new APIfeatures(Product.find(), req.query)
                .filtering()
                .sorting()
                .paginating()

            const products = features.query()

            res.json({
                status: 'success',
                result: products.length,
                products: products,
            })
        } catch (e) {
            return res.status(500).json({
                msg: e.message,
            })
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const { id } = req.params

            const existedProduct = await Product.findById(id)

            if (!existedProduct) {
                return res.status(400).json({
                    msg: 'Product does not exist',
                })
            }

            await Product.findByIdAndDelete(id)

            res.json({
                msg: 'Deleted a product',
            })
        } catch (e) {
            return res.status(500).json({
                msg: e.message,
            })
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const {
                product_id,
                title,
                price,
                description,
                content,
                images,
                category,
            } = req.body

            const { id } = req.params

            if (!images) return res.status(400).json({ msg: 'No image upload' })

            const existedProduct = await Product.findById(id)

            if (!existedProduct) {
                return res.status(400).json({
                    msg: 'Product does not exist',
                })
            }

            const data = {
                product_id,
                title,
                price,
                description,
                content,
                images,
                category,
            }
            _.omitBy(data, _.isNull)

            await Products.findOneAndUpdate({ _id: id }, data)

            res.json({ msg: 'Updated a Product' })
        } catch (e) {
            return res.status(500).json({
                msg: e.message,
            })
        }
    },
}

module.exports = productCtl
