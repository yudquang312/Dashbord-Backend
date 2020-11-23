const router = require('express').Router()
const userCtl = require('../controllers/user.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register', userCtl.register)

router.post('/activation', userCtl.activationEmail)

router.post('/login', userCtl.login)

router.post('/refresh_token', userCtl.getAccessToken)

router.post('/forgot_password', userCtl.forgotPassword)

router.post('/reset', auth, userCtl.resetPassword)

router.get('/infor', auth, userCtl.getUserInfor)

router.get('/all_infor', auth, authAdmin, userCtl.getUsersAllInfor)

router.get('/logout', userCtl.logout)

router.delete('/delete/:id', auth, authAdmin, userCtl.deleteUser)

router.patch('/update', auth, userCtl.updateUser)

router.patch('/update_role/:id', auth, authAdmin, userCtl.updateUsersRole)

router.post('/google_login', userCtl.googleLogin)

router.post('/facebook_login', userCtl.facebookLogin)
module.exports = router
