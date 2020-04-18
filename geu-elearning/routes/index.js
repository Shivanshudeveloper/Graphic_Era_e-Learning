// Bring Exrpess
const express = require('express');
const router = express.Router();
// Uniqid
const uniqid = require('uniqid');

// User Module
const User = require('../models/Users');
// User Module
const Transaction_Module = require('../models/Transaction');
// All Courses Module
const AllCourses_Module = require('../models/AddCourse');
// Courses Buyed Module
const CoursesBuyed_Module = require('../models/CoursesBuyed');
// Video Lecture Module
const VideoLecture_Module = require('../models/Video');

// Ensure Authentication
const { ensureAuthenticated } = require('../config/auth');
// Stripe
const stripe = require('stripe')('sk_test_AgT8zXROkPwne3MJjFusPtxi00TA1Hoi4u');

// Home Main Page
router.get('/', (req, res) => {
    res.render('main')
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    req.session.name = req.user.name;
    req.session.admission = req.user.admission;
    req.session.userid = req.user.id;
    // Calling the Render Dashboard Page
    res.render('dashboard', {
        name: req.session.name,
        admissionId: req.session.admission
    })
})


// Courses
router.get('/courses', ensureAuthenticated, (req, res) => {
    AllCourses_Module.find({})
        .then(allCourses => {
            res.render('courses', {
                name: req.session.name,
                admissionId: req.session.admission,
                allCourses: allCourses
            })
        })
        .catch(err => console.log(err))
    
})

// View Course
router.get('/viewcourse/:id', ensureAuthenticated, (req, res) => {
    const course_id = req.params.id;
    const userId = req.session.userid;

    // Generating a UserID with Date
    var dateId = Date.now().toString();
    var orderId = uniqid() + dateId;


    AllCourses_Module.find( {'_id': course_id} )
        .then(allCourses => {
            res.render('viewcourse', {
                name: req.session.name,
                admissionId: req.session.admission,
                allCourses: allCourses,
                orderId: orderId,
                userId: userId
            })
        })
        .catch(err => console.log(err))
    
})

/**
 * @Stripe Test Please Work :|
 * Please....
 */
router.get('/teststripe', ensureAuthenticated, (req, res) => {
    stripe.charges.create({
        amount: 2000,
        currency: "inr",
        source: "tok_mastercard", // obtained with Stripe.js
        description: "Charge for jenny.rosen@example.com",
        capture: true,
        
    }, {
        idempotency_key: "GBaay3kBs33Joa86"
    }, function(err, charge) {
        if (err) {
            console.log(err)
        }
        console.log(charge)
    });
})

// Transaction API Request
router.post('/transactionrequest', (req, res) => {
    const order_id = req.body.order_id,
          txn_id = req.body.txn_id,
          txn_amount = req.body.txn_amount,
          currency = req.body.currency,
          status = req.body.status,
          resp_code = req.body.resp_code,
          resp_msg = req.body.resp_msg;
          cust_id = req.body.cust_id;
          invoice_id = req.body.invoice_id;
          order_name = req.body.order_name;
          product_id = req.body.product_id;

    
    
    // Check if Transaction Record Already Exist
    Transaction_Module.countDocuments({'product_id': product_id, 'cust_id': cust_id})
        .then((count) => {
            if (count == 0) {
                const newTransaction = new Transaction_Module({
                    order_id,
                    cust_id,
                    invoice_id,
                    product_id,
                    order_name,
                    txn_id,
                    txn_amount,
                    currency,
                    status,
                    resp_code,
                    resp_msg
                });
                newTransaction.save();

                if (status == "TXN_SUCCESS") {
                    const courseBuyed = new CoursesBuyed_Module({
                        order_id,
                        cust_id,
                        product_id,
                        order_name,
                        txn_id,
                    });
                    courseBuyed.save();
                }
            }
        })
})

// My Courses Route 
router.get('/mycourses', ensureAuthenticated, (req, res) => {
    const userId = req.session.userid;
    // For for customer info
    var coursesInfo = [];
    var countBuyedCourses = 0;
    // For Counter of Synchronous Function
    var i = 0;

    CoursesBuyed_Module.countDocuments({'cust_id': userId})
    .then(count => {
        countBuyedCourses = count;
        if (count == 0) {
            res.render('mycourses', {
                name: req.session.name,
                admissionId: req.session.admission,
                userId: userId,
                coursesInfo: coursesInfo,
                coursesFound: false
            })
        } else {
            CoursesBuyed_Module.find( {'cust_id': userId} )
            .then(allCourses => {
                allCourses.forEach((courses_details) => {
                    var p_id = courses_details.product_id;
                    AllCourses_Module.find( {'_id': p_id} )
                        .then(courses => {
                            courses.forEach((coursesDetails) => {
                                i = i + 1;
                               var details = {
                                    coursename: coursesDetails.coursename,
                                    coursedescription: coursesDetails.coursedescription,
                                    courseprogram: coursesDetails.courseprogram,
                                    courselevel: coursesDetails.courselevel,
                                    coursedurationyear: coursesDetails.durationyear,
                                    coursedurationmonth: coursesDetails.durationmonth,
                                    courseprice: coursesDetails.totalfee,
                                    videotitle: coursesDetails.videotitle,
                                    courseid: coursesDetails.id,
                               }
                                coursesInfo.push(details)
                                if (i == countBuyedCourses) {
                                    res.render('mycourses', {
                                        name: req.session.name,
                                        admissionId: req.session.admission,
                                        userId: userId,
                                        coursesInfo: coursesInfo,
                                        coursesFound: true
                                    })
                                }
                            })
                        })
                })
            })
            .catch(err => console.log(err))
        }
    })
    .catch(err => console.log(err))

    

    
})


// Playing Video as per User
router.get('/seevideos/:c_id/:v_id', ensureAuthenticated, (req, res) => {
    const course_id = req.params.c_id;
    const video_id = req.params.v_id;

    AllCourses_Module.findOne({ '_id': course_id })
        .then(course => {
            var courseNAME = course.coursename;
            if (video_id == 1) {
                VideoLecture_Module.find({ 'courseid': course_id })
                .then(allVideos => {
                    VideoLecture_Module.findOne({})
                        .then(videoPlaying => {
                            res.render('seevideos', {
                                allVideos: allVideos,
                                course_id: course_id,
                                videoURL: videoPlaying.videourl,
                                videoTITLE: videoPlaying.videotitle,
                                courseNAME: courseNAME
                            });
                        })
                })
                .catch(err => console.log(err))
            } else {
                VideoLecture_Module.find({ 'courseid': course_id })
                .then(allVideos => {
                    VideoLecture_Module.findOne({'_id': video_id})
                        .then(videoPlaying => {
                            res.render('seevideos', {
                                allVideos: allVideos,
                                course_id: course_id,
                                videoURL: videoPlaying.videourl,
                                videoTITLE: videoPlaying.videotitle,
                                courseNAME: courseNAME
                            });
                        })
                })
                .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))


    
})




// Exporting Module
module.exports = router