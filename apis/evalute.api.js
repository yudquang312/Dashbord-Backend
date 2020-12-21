const router = require('express').Router()
const evaluteCtl = require('../controllers/evalute.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/evalutes')
    .post(auth, evaluteCtl.create)
    .get(auth, authAdmin, evaluteCtl.getAllByAdmin)

router.route('/product/:id/evalutes').get(evaluteCtl.getAllByProduct)
router
    .route('/evalutes/:id')
    .get(auth, evaluteCtl.getOne)
    .delete(auth, authAdmin, evaluteCtl.delete)
