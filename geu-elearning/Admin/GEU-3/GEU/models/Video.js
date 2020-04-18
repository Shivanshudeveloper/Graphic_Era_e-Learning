const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
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
    subjectid: {
        type: String,
        required: true
    },
    subjectname: {
        type: String,
        required: true
    },
    chapterid: {
        type: String,
        required: true
    },
    videotitle: {
        type: String,
        required: true
    },
    videodescription: {
        type: String,
        required: true
    },
    videourl: {
        type: String,
        required: true
    },
    introductoryvideo: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const VideoLecture = mongoose.model('VideoLecture', VideoSchema);
module.exports = VideoLecture;