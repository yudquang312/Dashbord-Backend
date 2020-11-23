const Category = require('../models/categories.model')

const categoryCtl = {
    getCategories: async (req, res, next) => {
        try {
            const categories = Category.find()
            res.json(categories)
        } catch (e) {
            return res.status(500).json({ msg: e.msg })
        }
    },
    createCategory: async (req, res, next) => {
        try {
            const { name } = req.body
            const existCategory = await Category.findOne({ name })
            if (existCategory) {
                return res
                    .status(400)
                    .json({ msg: 'this Category already exist' })
            }

            const category = new Category({ name })

            await Category.save()

            res.json({
                msg: 'Create category success',
            })
        } catch (e) {
            return res.status(500).json({ msg: e.msg })
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            const { id } = req.params

            const existedCategory = await Category.findById(id)

            if (!existedCategory) {
                return res.status(400).json({
                    msg: 'Category does not exist',
                })
            }

            await Category.findByIdAndDelete(id)

            return res.json({ msg: 'Delete category success' })
        } catch (e) {
            return res.status(500).json({ msg: e.msg })
        }
    },
    updateCategory: async (req, res, next) => {
        try {
            const { name } = req.body
            const { id } = req.params

            await Category.findOneAndUpdate({ _id: id }, { name })
            res.json({ msg: 'Updated a category' })
        } catch (e) {
            return res.status(500).json({ msg: e.msg })
        }
    },
}

module.exports = categoryCtl
