const router = require('express').Router()
const evaluteCtl = require('../controllers/evalute.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/evalute')
    .post(auth, evaluteCtl.create)
    .get(auth, authAdmin, evaluteCtl.getAllByAdmin)

router.route('/product/:id/evalute').get(evaluteCtl.getAllByProduct)
router
    .route('/evalute/:id')
    .get(auth, evaluteCtl.getOne)
    .delete(auth, authAdmin, evaluteCtl.delete)
