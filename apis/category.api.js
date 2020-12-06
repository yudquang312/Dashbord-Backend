const router = require('express').Router()
const categoryCtl = require('../controllers/category.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/category')
    .get(categoryCtl.getAll)
    .post(auth, authAdmin, categoryCtl.create)
router
    .route('/category/:id')
    .get(categoryCtl.getOne)
    .delete(auth, authAdmin, categoryCtl.delete)
    .put(auth, authAdmin, categoryCtl.update)
module.exports = router
