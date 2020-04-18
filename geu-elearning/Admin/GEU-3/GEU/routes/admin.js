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

//Upload File to AWS S3
var s3 = new aws.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
});

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
    console.log(req.session.login);
    Course.find({})
    .then(course => {
        if(!course) {
            console.log('No courses found');
            resp.render('courses', {
                login: req.session.login
            });
        }
        else {
            console.log(course);
            resp.render('courses', {
                coursedetails: course,
                login: req.session.login
            });
        } 
    })
    .catch(err => console.log(err));
});

//Show course details
router.get('/coursedetails', (req, resp) => {
    Subject.find({ courseid: req.query.courseid})
    .then(subject => {
        if(!subject) {
            console.log('No Subjects found for this course');
            resp.render('coursedetails', {
                coursename: req.query.course,
                courseid: req.query.courseid,
                login: req.session.login
            });
        }
        else {
            console.log(subject);
            resp.render('coursedetails', {
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
router.get('/subjectdetails', (req, resp) => {
    Course.findOne({ _id: req.query.courseid })
    .then(course => {
        if(!course) {
            console.log('Course not found');
            resp.render('subjectdetails', {
                subjectname: req.query.subject,
                subjectid: req.query.subjectid,
                courseid: req.query.courseid,
                login: req.session.login
            });
        }
        else {
            Subject.findOne({ _id: req.query.subjectid })
            .then(subject => {
                if(!subject) {
                    console.log("Subject not found");
                    resp.render('subjectdetails', {
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
                            resp.render('subjectdetails', {
                                subjectname: req.query.subject,
                                subjectid: req.query.subjectid,
                                courseid: req.query.courseid,
                                login: req.session.login
                            });
                        }
                        else {
                            resp.render('subjectdetails', {
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


//Add Subject
router.get('/addsubject', (req, resp) => {
    resp.render('newsubject', {
        courseid: req.query.courseid,
        login: req.session.login
    });
});

//Get subject details from the form and add it to the database
router.post('/subjectadd', (req, resp) => {
    const { courseid, subjecttitle, subjectdescription, subjectdurationhrs, subjectdurationmin, facultyid, facultyname } = req.body;
    var coursedetails;
    Course.findOne({ _id: courseid})
    .then(course => {
        if(!course) {
            console.log('No course found');
            Subject.find({ courseid: req.query.courseid})
            .then(subject => {
                if(!subject) {
                    console.log('No Subjects found for this course');
                    resp.render('coursedetails', {
                        coursename: req.query.course,
                        courseid: req.query.courseid,
                        login: req.session.login
                    });
                }
                else {
                    console.log(subject);
                    resp.render('coursedetails', {
                        coursename: req.query.course,
                        courseid: req.query.courseid,
                        subjectdetails: subject,
                        login: req.session.login
                    });
                }
            })
            .catch(err => console.log(err));
        }
        else {
            console.log(course);
            Subject.findOne({ subjecttitle: subjecttitle })
            .then(subject => {
                if(subject) {
                    console.log('Subject already exists');
                    Subject.find({ courseid: req.query.courseid})
                    .then(subject => {
                        if(!subject) {
                            console.log('No Subjects found for this course');
                            resp.render('coursedetails', {
                                coursename: req.query.course,
                                courseid: req.query.courseid,
                                login: req.session.login
                            });
                        }
                        else {
                            console.log(subject);
                            resp.render('coursedetails', {
                                coursename: req.query.course,
                                courseid: req.query.courseid,
                                subjectdetails: subject,
                                login: req.session.login
                            });
                        }
                    })
                    .catch(err => console.log(err));
                }
                else {
                    console.log(courseid);
                    const newSubject = new Subject({
                        subjecttitle: subjecttitle,
                        subjectdescription: subjectdescription,
                        subjectdurationhrs: subjectdurationhrs,
                        subjectdurationmin: subjectdurationmin,
                        facultyid: facultyid,
                        facultyname: facultyname,
                        courseid: courseid,
                        coursename: course.coursename,
                    });
                    newSubject.save();
                    console.log(newSubject);
                    Subject.find({ courseid: req.query.courseid})
                    .then(subject => {
                        if(!subject) {
                            console.log('No Subjects found for this course');
                            resp.render('coursedetails', {
                                coursename: req.query.course,
                                courseid: req.query.courseid,
                                login: req.session.login
                            });
                        }
                        else {
                            console.log(subject);
                            resp.render('coursedetails', {
                                coursename: req.query.course,
                                courseid: req.query.courseid,
                                subjectdetails: subject,
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

//Show all faculties
router.get('/faculty', (req, resp) => {
    NewFaculty.find({ type: 'faculty'})
    .then(faculty => {
        console.log(faculty);
        resp.render('allfaculty', {
            faculties: faculty,
            login: req.session.login
        });
    })
    .catch(err => console.log(err));
    
});

//Show new faculty account form
router.get('/newfaculty', (req, resp) => {
    resp.render('newfaculty', {
        login: req.session.login
    });
});

//Create new Faculty Account
router.post('/addfaculty', (req, resp) => {
    const { firstname, lastname, facultyid, course, subject, facultyemail, password } = req.body;
    let errors = [];

    NewFaculty.findOne({facultyid: facultyid})
    .then(faculty => {
        if(faculty) {
            //User Exists
            errors.push({msg: 'Faculty Already exists'});
            NewFaculty.find({ type: 'faculty'})
            .then(faculty => {
                console.log(faculty);
                resp.render('allfaculty', {
                    faculties: faculty,
                    login: req.session.login
                });
            })
            .catch(err => console.log(err));
        }
        else {
            const newFaculty = new NewFaculty({
                facultyid: facultyid,
                facultyname: firstname + ' ' + lastname,
                course: course,
                subject: subject,
                email: facultyemail,
                password: password,
                type: "faculty"
            });
            newFaculty.save();
            console.log(newFaculty);
            NewFaculty.find({ type: 'faculty'})
            .then(faculty => {
                console.log(faculty);
                resp.render('allfaculty', {
                    faculties: faculty,
                    login: req.session.login
                });
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
});

//Add new Course
router.get('/newcourse', (req, resp) => {
    resp.render('newcourse', {
        login: req.session.login
    });
});


//Get the course details from the form and Add the course to the database
router.post('/upload', (req,resp)=> {
    const { coursename, coursedescription, courselevel, durationyear, durationmonth, registrationfee, tuitionfee, totalfee } = req.body;
    console.log(req.body);
    let errors = [];

    /* //Check Required Fields
    if(!coursename || !coursedescription || !courseprogram || !courselevel || durationyear || durationmonth || facultyid || facultyname || registrationfee || tuitionfee || totalfee) {
        errors.push({msg: 'Please Fill in All Fields'});
    } */

    if(errors.length > 0) {
        Course.find({})
        .then(course => {
            if(!course) {
                console.log('No courses found');
                resp.render('courses', {
                    login: req.session.login
                });
            }
            else {
                console.log(course);
                resp.render('courses', {
                    coursedetails: course,
                    login: req.session.login
                });
            } 
        })
        .catch(err => console.log(err));
    }
    else {
        //Validation Passed
        Course.findOne({coursename: coursename})
        .then(course => {
            if(course) {
                //User Exists
                console.log('Course Already exists');
                errors.push({msg: 'Course Already exists'});
                Course.find({})
                .then(course => {
                    if(!course) {
                        console.log('No courses found');
                        resp.render('courses', {
                            login: req.session.login
                        });
                    }
                    else {
                        console.log(course);
                        resp.render('courses', {
                            coursedetails: course,
                            login: req.session.login
                        });
                    } 
                })
                .catch(err => console.log(err));
            }
            else {
                const newCourse = new Course({
                    coursename: coursename,
                    coursedescription: coursedescription,
                    courselevel: courselevel,
                    durationyear: durationyear,
                    durationmonth: durationmonth,
                    registrationfee: registrationfee,
                    tuitionfee: tuitionfee,
                    totalfee: totalfee
                });
                newCourse.save();
                Course.find({})
                .then(course => {
                    if(!course) {
                        console.log('No courses found');
                        resp.render('courses', {
                            login: req.session.login
                        });
                    }
                    else {
                        console.log(course);
                        resp.render('courses', {
                            coursedetails: course,
                            login: req.session.login
                        });
                    } 
                })
                .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    }
});


module.exports = router;