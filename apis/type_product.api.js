const router = require('express').Router()
const typeProductCtl = require('../controllers/type_product.controler')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/type_products')
    .get(typeProductCtl.getAll)
    .post(auth, authAdmin, typeProductCtl.create)
router
    .route('/type_products/:id')
    .get(typeProductCtl.getOne)
    .delete(auth, authAdmin, typeProductCtl.delete)
    .put(auth, authAdmin, typeProductCtl.update)
module.exports = router
