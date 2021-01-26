const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../helper/mailer')
const _ = require('lodash')
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const fetch = require('node-fetch')
const client = new OAuth2(process.env.MAILLING_SERVICE_CLIENT_ID)
const mongoose = require('mongoose')
const {
    CLIENT_URL,
    ACCESS_TOKEN_SECRET,
    ACTIVATION_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
} = process.env
const userCtl = {
    register: async (req, res, next) => {
        try {
            const { email, password, name } = req.body

            if (!email || !password || !name) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }

            if (!validateEmail(email)) {
                return res.status(400).json({
                    msg: 'Invalid email.',
                })
            }

            const user = await User.findOne({ email })

            if (user) {
                return res.status(400).json({
                    msg: 'This email already exists.',
                })
            }

            if (password.length < 8) {
                return res.status(400).json({
                    msg: 'Password must be at least 6 character.',
                })
            }
            const hashPassword = await bcrypt.hash(password, 12)

            const newUser = { email, name, password: hashPassword }

            const activation_token = createActivationToken(newUser)

            const url = `${CLIENT_URL}/user/activate/${activation_token}`

            sendMail(email, url, 'Verify your email address')

            res.status(201).json({
                msg: 'Register success! Please activate your email to start',
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    activationEmail: async (req, res, next) => {
        try {
            const { activation_token } = req.body

            const user = jwt.verify(
                activation_token,
                process.env.ACTIVATION_TOKEN_SECRET,
            )

            if (!user) {
                return res.status(400).json({
                    msg: 'Invalid Token',
                })
            }

            const { name, email, password } = user

            const check = await User.findOne({ email })
            if (check) {
                return res.status(400).json({
                    msg: 'This email already exists.',
                })
            }

            const newUser = new User({
                name,
                email,
                password,
            })

            await newUser.save()

            res.status(201).json({ msg: 'Account has been activated!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email, deletedAt: undefined })
            if (!user) {
                return res
                    .status(400)
                    .json({ msg: 'This email does not exist.' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ msg: 'Password is incorrect.' })
            }

            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refresh_token', refresh_token, {
                httpOnly: false,
                path: '/user/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days
            })
            res.status(200).json({ msg: 'Login success!', user: user })
        } catch (e) {
            return res.status(500).json({
                msg: e.message,
            })
        }
    },
    getAccessToken: async (req, res, next) => {
        try {
            const rf_token = req.cookies.refresh_token
            if (!rf_token) {
                return res.status(400).json({ msg: 'Please login now.' })
            }

            jwt.verify(
                rf_token,
                process.env.REFRESH_TOKEN_SECRET,
                (err, user) => {
                    if (err) {
                        return res.status(400).json({
                            msg: 'Please login now.',
                        })
                    }
                    const access_token = createAccessToken({ id: user.id })
                    res.status(200).json({
                        access_token: access_token,
                    })
                },
            )
        } catch (e) {
            return res.status(500).json({
                msg: e.message,
            })
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res
                    .status(400)
                    .json({ msg: 'This email does not exist.' })
            }
            const access_token = createAccessToken({ id: user.id })
            const url = `${CLIENT_URL}/user/reset/${access_token}`
            sendMail(email, url, 'Reset your password')
            res.status(200).json({
                msg: 'Re-send the password, please check your email',
            })
        } catch (e) {
            return res.status(500).json({
                msg: e.message,
            })
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { user, body } = req
            const { oldPassword, newPassword } = body
            if (!oldPassword || !newPassword || !user) {
                return res
                    .status(400)
                    .json({ msg: 'Please fill in all fields.' })
            }
            const getUser = await User.findOne({
                _id: user.id,
            }).lean()
            if (!getUser) {
                return res.status(400).json({ msg: 'User not found' })
            }
            const isMatch = await bcrypt.compare(oldPassword, getUser.password)
            if (!isMatch) {
                return res.status(400).json({ msg: 'Password is incorrect.' })
            }
            const hashPassword = await bcrypt.hash(newPassword, 12)

            await User.findOneAndUpdate(
                { _id: user.id },
                {
                    password: hashPassword,
                },
            )

            res.status(200).json({ msg: 'Password successfully changed!' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                msg: e.message,
            })
        }
    },
    getUserInfor: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).select('-password')
            res.status(200).json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUsersAllInfor: async (req, res, next) => {
        try {
            const users = await User.find({ deletedAt: undefined }).select(
                '-password',
            )

            res.status(200).json(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refresh_token', { path: '/user/refresh_token' })
            return res.status(200).json({ msg: 'Logged out.' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            // console.log('delete User')
            // console.log(req.params.id)
            // const user = await User.findById(req.params.id)
            // console.log(user)
            await User.updateOne(
                { _id: req.params.id },
                { deletedAt: Date.now() },
            )

            res.status(200).json({ msg: 'Deleted Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const { role } = req.body

            await User.findOneAndUpdate(
                { _id: req.params.id },
                {
                    role,
                },
            )

            res.status(200).json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const {
                name,
                avatar,
                gender,
                nation,
                provincial,
                district,
                wards,
                address,
                phone,
            } = req.body
            const data = {
                name,
                avatar,
                gender,
                nation,
                provincial,
                district,
                wards,
                address,
                phone,
            }
            for (let key in data) {
                if (!data[key]) delete data[key]
            }

            await User.findOneAndUpdate({ _id: req.user.id }, data)

            res.status(200).json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    googleLogin: async (req, res, next) => {
        try {
            const { tokenId } = req.body
            const verify = await client.verifyIdToken({
                idToken: tokenId,
                audience: process.env.MAILLING_SERVICE_CLIENT_ID,
            })
            const { email_verified, email, name, picture } = verify.payload

            const password = email + process.env.GOOGLE_SECRET
            const passwordHash = await bcrypt.hash(password, 12)
            if (!email_verified) {
                return res
                    .status(400)
                    .json({ msg: 'Email verification failed.' })
            }
            const user = await User.findOne({ email })
            if (user) {
                const refresh_token = createRefreshToken({ id: user.id })
                res.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 7 ngay
                })
                res.status(200).json({ msg: 'Login succes' })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password: passwordHash,
                    avatar: picture,
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 7 ngay
                })
                res.status(200).json({ msg: 'Login succes' })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    facebookLogin: async (req, res, next) => {
        try {
            const { accessToken, userID } = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

            const data = await fetch(URL)
                .then((res) => res.json())
                .then((res) => res)

            const { id, email, name, picture } = data

            if (!email)
                return res
                    .status(400)
                    .json({ msg: 'Require email from facebook' })

            const user = await User.findOne({ email })

            const password = email + process.env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if (user) {
                const refresh_token = createRefreshToken({ id: user.id })
                res.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 7 ngay
                })
                res.status(200).json({ msg: 'Login succes' })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password: passwordHash,
                    avatar: picture.data.url,
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 7 ngay
                })
                res.status(200).json({ msg: 'Login succes' })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    changeCart: async (req, res, next) => {
        try {
            console.log(1)
            const { user, body } = req

            const cart = body.cart.map((ca) => {
                ca.sizeId = mongoose.Types.ObjectId(ca.sizeId)
                return ca
            })
            const existUser = await User.findById(user.id)
            if (!existUser) {
                return res.status(400).json({ msg: 'User does not exist' })
            }

            await User.findOneAndUpdate(
                { _id: user.id },
                {
                    cart: cart,
                },
            )

            return res.json({ msg: 'Change to cart' })
        } catch (e) {
            console.log(err)
            return res.status(500).json({ msg: e.msg })
        }
    },
    getCart: async (req, res, next) => {
        try {
            const cart = await User.findById(req.user.id)
                .select('cart')
                .populate({
                    path: 'cart.sizeId',
                    model: 'Size',
                })
                .populate({
                    path: 'cart.productId',
                    select: '-inputPrice',
                    populate: {
                        path: 'sizes.sizeId',
                    },
                })
            res.status(200).json(cart)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInforByAdmin: async (req, res, next) => {
        try {
            const { id } = req.params
            const user = await User.findOne({ _id: id }).select('-password')
            if (!user) {
                return res.status(400).json({ msg: 'User not found' })
            }
            return res.status(200).json(user)
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
}

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

const createActivationToken = (payload) =>
    jwt.sign(payload, ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })

const createAccessToken = (payload) =>
    jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

const createRefreshToken = (payload) =>
    jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' })

module.exports = userCtl
