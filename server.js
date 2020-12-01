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
    }),
)
// app.options('*', cors())

app.use('/user', require('./routes/user.router'))
app.use('/api', require('./routes/upload.router'))
app.use('/api', require('./routes/color.router'))
app.use('/api', require('./routes/size.router'))
app.use('/api', require('./routes/type_product.router'))
//connect database
require('./helper/init-mongoose')
// Routes

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('Server is runing port ', PORT))
