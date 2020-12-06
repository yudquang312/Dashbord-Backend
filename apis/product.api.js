const router = require('express').Router()
const productCtl = require('../controllers/product.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/products')
    .post(auth, authAdmin, productCtl.create)
    .get(productCtl.getAllProduct)
router
    .route('/products/:id')
    .get(productCtl.getProduct)
    .delete(auth, authAdmin, productCtl.deleteProduct)
    .patch(auth, authAdmin, productCtl.update)

module.exports = router
