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
    date: {
        type: Date,
        default: Date.now
    }
});

const VideoLecture = mongoose.model('VideoLecture', VideoSchema);
module.exports = VideoLecture;