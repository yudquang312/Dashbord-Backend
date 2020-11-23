const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please enter your email'],
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please enter your password'],
        },
        role: {
            type: Number,
            default: 0,
        },
        cart: {
            type: Array,
            default: [],
        },
        male: {
            type: Number,
            default: 0,
        },
        avatar: {
            type: 'String',
            default:
                'https://res.cloudinary.com/thaovan/image/upload/v1606099416/Dinosuar_shop/avatar/male.jpg',
        },
        facebookId: {
            type: 'String',
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('User', userSchema, 'users')
