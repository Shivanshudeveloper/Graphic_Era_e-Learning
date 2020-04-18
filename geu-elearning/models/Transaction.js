const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    cust_id: {
        type: String,
        required: true
    },
    invoice_id: {
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
    txn_amount: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    resp_code: {
        type: String,
        required: true
    },
    resp_msg: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction