const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subjecttitle: {
        type: String,
        required: true
    },
    subjectdescription: {
        type: String,
        required: true
    },
    subjectdurationhrs: {
        type: String,
        required: true
    },
    subjectdurationmin: {
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
    courseid: {
        type: String,
        required: true
    },
    coursename: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;