const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    chaptertitle: {
        type: String,
        required: true
    },
    chapterdescription: {
        type: String,
        required: true
    },
    subjectid: {
        type: String,
        required: true
    },
    subjectname: {
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
    facultyid: {
        type: String,
        required: true
    },
    facultyname: {
        type: String,
        required: true
    },
    url : {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Chapter = mongoose.model('Chapter', ChapterSchema);
module.exports = Chapter;