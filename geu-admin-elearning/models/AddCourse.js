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
    courseduration: {
        type: String,
        required: true
    },
    courseprice: {
        type: String,
        required: true
    },
    videotitle: {
        type: String,
        required: true
    },
    coursevideo: {
        type: String,
        required: true
    }
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;