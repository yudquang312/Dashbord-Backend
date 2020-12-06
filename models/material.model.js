const mongoose = require('mongoose')

const materialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter material name '],
            unique: true,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Material', materialSchema, 'Materials')
