const router = require('express').Router()
const typeProductCtl = require('../controllers/type_product.controler')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/type_products')
    .get(typeProductCtl.getAll)
    .post(authAdmin, typeProductCtl.create)
router
    .route('/type_products/:id')
    .get(typeProductCtl.getOne)
    .delete(authAdmin, typeProductCtl.delete)
    .put(authAdmin, typeProductCtl.update)
module.exports = router
