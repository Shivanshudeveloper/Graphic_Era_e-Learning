const mongoose = require('mongoose');

const NewFacultySchema = new mongoose.Schema({
    facultyid: {
        type: String,
        required: true
    },
    facultyname: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const NewFaculty = mongoose.model('NewFaculty', NewFacultySchema);
module.exports = NewFaculty;