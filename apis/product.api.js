const router = require('express').Router()
const productCtl = require('../controllers/product.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/products').post(auth, authAdmin, productCtl.create)

module.exports = router
