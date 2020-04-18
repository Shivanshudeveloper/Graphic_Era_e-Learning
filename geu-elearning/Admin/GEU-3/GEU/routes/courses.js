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

//View all courses
router.get('/view', (req, resp) =>{
    let errors = [];
    resp.render('courses', {
        login: req.session.login,
        course: course
    });
    /* Course.find({})
    .then(course => {
        resp.render('courses', {
            login: req.session.login,
            course: course
        });
    })
    .catch(err => console.log(err)) */
    
});

//Add new course
router.get('/new', (req, resp) => resp.render('newcourse', {
    login: req.session.login
}));

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
        resp.render('newcourse', {
            errors,
            coursename,
            coursedescription,
            courselevel,
            durationyear,
            durationmonth,
            registrationfee,
            tuitionfee,
            totalfee,
            login: req.session.login
        });
    }
    else {
        //Validation Passed
        Course.findOne({coursename: coursename})
        .then(course => {
            if(course) {
                //User Exists
                console.log('Course Already exists');
                errors.push({msg: 'Course Already exists'});
                resp.render('newcourse', {
                    errors,
                    coursename,
                    coursedescription,
                    courselevel,
                    durationyear,
                    durationmonth,
                    registrationfee,
                    tuitionfee,
                    totalfee,
                    login: req.session.login
                });
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
                resp.render('courses', {
                    errors,
                    coursename,
                    coursedescription,
                    courselevel,
                    durationyear,
                    durationmonth,
                    registrationfee,
                    tuitionfee,
                    totalfee,
                    login: req.session.login
                });
            }
        })
        .catch(err => console.log(err));
    }
});

//View individual course details
router.get('/details', (req, resp) => {
    courseid = req.query.id;

    Course.findOne({ _id: courseid })
    .then(course=> {
        resp.render('coursedetails', {
            login: req.session.login,
            details: course
        })
    })
    .catch(err => console.log(err));
});

module.exports = router;