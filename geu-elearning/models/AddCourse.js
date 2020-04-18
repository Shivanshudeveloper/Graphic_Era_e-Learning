const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
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
    facultyid: {
        type: String,
        required: true
    },
    facultyname: {
        type: String,
        required: true
    },
    registrationfee: {
        type: String,
        required: true
    },
    tuitionfee: {
        type: String,
        required: true
    },
    totalfee: {
        type: String,
        required: true
    }
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;