const mongoose = require('mongoose')

const coursesBuyedSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    cust_id: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    order_name: {
        type: String,
        required: true
    },
    txn_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const CoursesBuyed = mongoose.model('CoursesBuyed', coursesBuyedSchema)
module.exports = CoursesBuyed