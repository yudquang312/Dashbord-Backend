require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const app = express()

app.use(express.json())
const header = {
    'Access-Control-Allow-Origin': '*',
}
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
        method: 'GET,HEAD,PUT,PATCH,DELETE,POST',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    }),
)
app.use(cookieParser())
app.use(
    fileUpload({
        useTempFiles: true,
        createParentPath: true,
    }),
)

const PORT = process.env.PORT || 5000

// io.origin('*:*')
const server = app.listen(PORT, () => {
    console.log('Server is runing port ', PORT)
})
require('./socket')(server)
// app.options('*', cors())

app.use('/user', require('./apis/user.api'))
app.use('/api', require('./apis/upload.api'))
app.use('/api', require('./apis/color.api'))
app.use('/api', require('./apis/size.api'))
app.use('/api', require('./apis/type_product.api'))
app.use('/api', require('./apis/style.api'))
app.use('/api', require('./apis/product.api'))
app.use('/api', require('./apis/material.api'))
app.use('/api', require('./apis/category.api'))
app.use('/api', require('./apis/order.api'))
app.use('/api', require('./apis/comment.api'))
app.use('/api', require('./apis/payment.api'))
//connect database
require('./helper/init-mongoose')
// Routes
