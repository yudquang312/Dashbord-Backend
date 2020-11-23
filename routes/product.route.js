const router = require('express').Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const productCtl = require('../controllers/product.controller')

router
    .route('/products')
    .get(productCtl.getProducts)
    .post(auth, authAdmin, productCtl.createProduct)

router
    .route('/products/:id')
    .delete(auth, authAdmin, productCtl.deleteProduct)
    .put(auth, authAdmin, productCtl.updateProduct)
