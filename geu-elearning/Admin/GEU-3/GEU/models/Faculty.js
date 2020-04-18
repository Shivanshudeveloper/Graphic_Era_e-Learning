const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    facultyid: {
        type: String,
        required: true
    },
    facultyname: {
        type: String,
        required: true
    },
    courseid: {
        type: String,
        required: true
    },
    coursename: {
        type: String,
        required: true
    },
    coursedescription: {
        type: String,
        required: true
    },
    courseprogram: {
        type: String,
        required: true
    },
    courselevel: {
        type: String,
        required: true
    },
    durationyear: {
        type: String,
        required: true
    },
    durationmonth: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Faculty = mongoose.model('Faculty', FacultySchema);
module.exports = Faculty;