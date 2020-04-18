const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');
const path = require('path');

const app = express();
const router = express.Router();

const BUCKET_NAME = 's3nodejs';
const IAM_USER_KEY = 'AKIAJEWLEBNJ2XQZJPGQ';
const IAM_USER_SECRET = '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';

var foldername = '';

//Course Model
const Course = require('../models/AddCourse'); 

//Faculty Model
const Faculty = require('../models/Faculty');

//New Faculty Model
const NewFaculty = require('../models/NewFaculty');

//Chapter Model
const Chapter = require('../models/Chapter');

//Subject Model
const Subject = require('../models/Subject');

//Show dashboard
router.get('/dashboard', (req, resp) => {
    resp.render('dashboard', {
        login: req.session.login
    });
});

//Show courses
router.get('/courses', (req, resp) => {
    userid = "1234567892";
    var coursesInfo = [];
    Subject.findOne({ facultyid: userid })
    .then(subject => {
        if(!subject) {
            console.log('No subjects regsitered for this faculty');
            resp.render('facultycourses', {
                login: req.session.login,
                userid: userid
            });
        }
        else {
            Course.findOne({ _id: subject.courseid})
            .then(course => {
                coursesInfo.push(course);

                resp.render('facultycourses', {
                    courses: coursesInfo,
                    login: req.session.login,
                    userid: req.session.userid
                });
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});

//Show course details
router.get('/coursedetailsfaculty', (req, resp) => {
    Subject.find({ courseid: req.query.courseid, facultyid: req.query.userid })
    .then(subject => {
        if(!subject) {
            console.log('No Subjects found for this course');
            resp.render('coursedetailsfaculty', {
                coursename: req.query.course,
                courseid: req.query.courseid,
                login: req.session.login
            });
        }
        else {
            console.log(subject);
            resp.render('coursedetailsfaculty', {
                userid: req.query.userid,
                coursename: req.query.course,
                courseid: req.query.courseid,
                subjectdetails: subject,
                login: req.session.login
            });
        }
    })
    .catch(err => console.log(err));
    
});


//Show subject details
router.get('/subjectdetailsfaculty', (req, resp) => {
    Course.findOne({ _id: req.query.courseid })
    .then(course => {
        if(!course) {
            console.log('Course not found');
            resp.render('subjectdetailsfaculty', {
                subjectname: req.query.subject,
                subjectid: req.query.subjectid,
                courseid: req.query.courseid,
                login: req.session.login
            });
        }
        else {
            Subject.findOne({ _id: req.query.subjectid, facultyid: req.query.userid })
            .then(subject => {
                if(!subject) {
                    console.log("Subject not found");
                    resp.render('subjectdetailsfaculty', {
                        subjectname: req.query.subject,
                        subjectid: req.query.subjectid,
                        courseid: req.query.courseid,
                        login: req.session.login
                    });
                }
                else {
                    Chapter.find({ subjectid: req.query.subjectid})
                    .then(chapter => {
                        if(!chapter) {
                            console.log('No Chapters found');
                            resp.render('subjectdetailsfaculty', {
                                subjectname: req.query.subject,
                                subjectid: req.query.subjectid,
                                courseid: req.query.courseid,
                                login: req.session.login
                            });
                        }
                        else {
                            resp.render('subjectdetailsfaculty', {
                                subjectname: req.query.subject,
                                subjectid: req.query.subjectid,
                                courseid: req.query.courseid,
                                chapterdetails: chapter,
                                login: req.session.login
                            });
                        }
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});

//Add chapter
router.post('/addchapter', (req, resp) => {
    const { courseid, subjectid, chaptertitle, chapterdescription } = req.body;
    Course.findOne({ _id: courseid })
    .then(course => {
        if(!course) {
            console.log('Course not found');
            resp.render('subjectdetailsfaculty', {
                subjectname: req.query.subject,
                subjectid: subjectid,
                courseid: courseid,
                userid: req.query.userid,
                login: req.session.login
            });
        }
        else {
            Subject.findOne({ _id: subjectid })
            .then(subject => {
                if(!subject) {
                    console.log("Subject not found");
                    resp.render('subjectdetailsfaculty', {
                        subjectname: req.query.subject,
                        subjectid: subjectid,
                        courseid: courseid,
                        userid: req.query.userid,
                        login: req.session.login
                    });
                }
                else {
                    console.log(subject);
                    Chapter.find({ chaptertitle: chaptertitle })
                    .then(chapter => {
                        if(chapter) {
                            console.log('Chapter already exists');
                            resp.render('subjectdetailsfaculty', {
                                subjectname: subject.subjecttitle,
                                subjectid: subjectid,
                                courseid: courseid,
                                chapterdetails: chapter,
                                userid: req.query.userid,
                                login: req.session.login
                            });
                        }
                        else {
                            const newChapter = new Chapter({
                                chaptertitle: chaptertitle,
                                chapterdescription: chapterdescription,
                                subjectid: subjectid,
                                subjectname: subject.subjecttitle,
                                courseid: courseid,
                                coursename: subject.coursename,
                                facultyid: subject.facultyid,
                                facultyname: subject.facultyname
                            });
                            newChapter.save();
                            console.log(newChapter);
                            resp.render('subjectdetailsfaculty', {
                                subjectname: subject.subjecttitle,
                                subjectid: subjectid,
                                courseid: courseid,
                                chapterdetails: newChapter,
                                userid: chapter.facultyid,
                                login: req.session.login
                            });
                        }
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});


//Upload File to AWS S3
var s3 = new aws.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
});

var upload = multer({
    storage: multers3({
        s3: s3,
        acl: 'public-read',
        bucket: 's3nodejs',
        metadata: function(req, file, cb) {
            cb(null, {fieldname: file.originalname});
        },
        key: function (req, file, cb) {
            let errors = [];
            //Check Required Fields
            /* if(!coursename || !coursedescription || !courseprogram || !courselevel || courseduration || courseprice || videotitle || coursevideo) {
                errors.push({msg: 'Please Fill in All Fields'});
            } */
            if(errors.length > 0) {
                console.log(errors);
            }
            else {

                Course.findOne({ _id: req.query.courseid })
                .then(course => {
                    if(!course) {
                        console.log('Course not found');
                        resp.render('addvideo', {
                            subjectname: req.query.subject,
                            subjectid: subjectid,
                            courseid: courseid,
                            userid: req.query.userid,
                            login: req.session.login
                        });
                    }
                    else {
                        Subject.findOne({ _id: req.query.subjectid })
                        .then(subject => {
                            if(!subject) {
                                console.log("Subject not found");
                                resp.render('addvideo', {
                                    subjectname: req.query.subject,
                                    subjectid: subjectid,
                                    courseid: courseid,
                                    userid: req.query.userid,
                                    login: req.session.login
                                });
                            }
                            else {
                                console.log(subject);
                                Chapter.find({ _id: req.query.chapterid })
                                .then(chapter => {
                                    if(!chapter) {
                                        console.log('Chapter does not exists');
                                        resp.render('addvideo', {
                                            subjectname: subject.subjecttitle,
                                            subjectid: subjectid,
                                            courseid: courseid,
                                            chapterdetails: chapter,
                                            userid: req.query.userid,
                                            login: req.session.login
                                        });
                                    }
                                    else {
                                        var url = "https://s3nodejs.s3.us-east-2.amazonaws.com/";
                                        url = url + subject.coursename + '/' + subject.subjectname + '/' + chapter.chaptertitle + '-' + file.originalname;

                                        const newVideo = new Video({
                                            facultyid: subject.facultyid,
                                            facultyname: subject.facultyname,
                                            courseid : subject.courseid,
                                            coursename: subject.coursename,
                                            subjectid: subject._id,
                                            subjectname: subjecttitle,
                                            chapterid: chapter._id,
                                            videotitle: req.body.videotitle,
                                            videodescription: req.body.videodescription,
                                            videourl: url,
                                            introductoryvideo: req.body.introductory
                                        });
                                        newVideo.save();
                                        resp.render('addvideo', {
                                            subjectname: subject.subjecttitle,
                                            subjectid: subjectid,
                                            courseid: courseid,
                                            chapterdetails: chapter,
                                            userid: req.query.userid,
                                            login: req.session.login
                                        });
                                    }
                                })
                                .catch(err => console.log(err));
                            }
                        })
                        .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
            }
        }
    })
});

//Faculty Profile Section
router.get('/profile', (req, resp) => resp.render('facultyprofile'));

//Upload Course Video Section
router.get('/videos', (req, resp) => { 
    resp.render('addvideo', {
        subjectname: req.query.subject,
        subjectid: req.query.subjectid,
        courseid: req.query.courseid,
        chapterid: req.query.chapterid,
        userid: req.query.userid,
        login: req.session.login 
    });
});


//Upload Course Assignment Section
router.get('/assignment', (req, resp) => { 
    resp.render('addassignment', {
        subjectname: req.query.subject,
        subjectid: req.query.subjectid,
        courseid: req.query.courseid,
        chapterid: req.query.chapterid,
        userid: req.query.userid,
        login: req.session.login
    });
});

//Upload video to aws s3
router.post('/upload', upload.single('video'), function(req, resp, next) {
    console.log("Video Added");
    resp.render('addvideo');
});

module.exports = router;