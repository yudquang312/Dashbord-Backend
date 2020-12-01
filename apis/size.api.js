const router = require('express').Router()
const sizeCtl = require('../controllers/size.controler')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/sizes').get(sizeCtl.getAll).post(auth, authAdmin, sizeCtl.create)
router
    .route('/sizes/:id')
    .get(sizeCtl.getOne)
    .delete(auth, authAdmin, sizeCtl.delete)
    .put(auth, authAdmin, sizeCtl.update)
module.exports = router
