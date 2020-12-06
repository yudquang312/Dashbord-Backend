const router = require('express').Router()
const materialCtl = require('../controllers/material.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/material')
    .get(materialCtl.getAll)
    .post(auth, authAdmin, materialCtl.create)
router
    .route('/material/:id')
    .get(materialCtl.getOne)
    .delete(auth, authAdmin, materialCtl.delete)
    .put(auth, authAdmin, materialCtl.update)
module.exports = router
