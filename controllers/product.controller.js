const Product = require('../models/product.model')
const ProductSize = require('../models/product-size.model')
const productCtl = {
    create: async (req, res, next) => {
        try {
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
            } = req.body
            if (
                !name ||
                !type ||
                images ||
                code ||
                description ||
                colors ||
                amount ||
                inputPrice ||
                salePrice ||
                sizes ||
                limited ||
                style
            ) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const nameExisted = await Product.findOne({ name })
            const codeExisted = await Product.findOne({ code })
            if (nameExisted) {
                return res.status(400).json({
                    msg: 'This product name already exists .',
                })
            }
            if (codeExisted) {
                return res.status(400).json({
                    msg: 'This product code already exists .',
                })
            }
            const size = sizes.map((sz) => {
                return sz.id
            })
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
                size,
                promotion,
                limited,
                style,
            })

            for (let key in newProduct) {
                !newProduct[key] && delete newProduct[key]
            }

            await newProduct.save()

            const productSize = sizes.map((sz) => {
                sz.productId = newProduct._id
                return sz
            })

            await ProductSize.insertMany(productSize)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
}
