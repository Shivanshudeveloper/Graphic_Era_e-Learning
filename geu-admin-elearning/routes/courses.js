const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');
const path = require('path');

const app = express();
const router = express.Router();

const BUCKET_NAME = 'geu-learning';
const IAM_USER_KEY = 'AKIATABWPVZP5TGCOLWI';
const IAM_USER_SECRET = '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';

var foldername = '';

//Upload File to AWS S3
var s3 = new aws.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
});

var upload = multer({
    storage: multers3({
        s3: s3,
        acl: 'public-read',
        bucket: 'geu-learning',
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
                Course.findOne({coursename: req.body.coursename})
                .then(course => {
                    if(course) {
                        //Course Exists
                        errors.push({ msg: 'Course Already Exists'});
                    }
        
                    else {
                        var url = "https://geu-learning.s3.us-east-1.amazonaws.com/";
                        url = url + req.body.courseprogram + '/' + req.body.coursename + '/' + file.originalname;
                        const newCourse = new Course({
                            coursename: req.body.coursename,
                            coursedescription: req.body.coursedescription,
                            courseprogram: req.body.courseprogram,
                            courselevel: req.body.courselevel,
                            courseduration: req.body.courseduration,
                            courseprice: req.body.courseprice,
                            videotitle: req.body.videotitle,
                            coursevideo: url
                        });
                    
                        newCourse.save()
                        .then(course => {
                            console.log('Course Added to the database');
                            foldername = req.body.courseprogram + '/' + req.body.coursename + '/';
                            cb(null, foldername + file.originalname.toString());
                        })
                        .catch(err => console.log(err));
                        }
                    })
                    .catch(err => console.log(err));
            }
        }
    })
});

//Course Model
const Course = require('../models/AddCourse'); 

//View all courses
router.get('/view', (req, resp) =>{
    let errors = [];
    resp.render('courses');
});

//Add new course
router.get('/new', (req, resp) => resp.render('newcourse'));

router.post('/upload', upload.single('coursevideo'), function(req, resp, next) {
    resp.render('newcourse');
});

module.exports = router;