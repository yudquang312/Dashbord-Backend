const router = require('express').Router()
const categoryCtl = require('../controllers/category.controller')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')

router
    .route('/category')
    .get(categoryCtl.getCategories)
    .post(auth, authAdmin, categoryCtl.createCategory)

router
    .route('/category/:id')
    .delete(categoryCtl.deleteCategory)
    .put(auth, authAdmin, categoryCtl.updateCategory)

module.exports = router
