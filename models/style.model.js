const mongoose = require('mongoose')

const styleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter style name '],
            unique: true,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Style', styleSchema, 'styles')
