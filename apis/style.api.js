const router = require('express').Router()
const styleCtl = require('../controllers/style.controler')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/styles')
    .get(styleCtl.getAll)
    .post(auth, authAdmin, styleCtl.create)
router
    .route('/styles/:id')
    .get(styleCtl.getOne)
    .delete(auth, authAdmin, styleCtl.delete)
    .put(auth, authAdmin, styleCtl.update)
module.exports = router
