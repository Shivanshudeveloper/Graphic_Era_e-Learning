const express = require('express');
const router = express.Router();

//User Model
const User = require('../models/NewFaculty');

//Login
router.get('/', (req, resp) => resp.render('login'));

//Dashboard
router.get('/dashboard', (req, resp) => resp.render('dashboard', {
    login: req.session.login
}));

//Courses
router.get('/courses', (req, resp) => resp.render('courses', {
    login: req.session.login
}));

//Course Upload
router.get('/newcourse', (req, resp) => resp.render('newcourse', {
    login: req.session.login
}));

//Handle login event
router.post('/login', (req, resp) => {
    const { userid, password } = req.body;
    User.findOne({ facultyid: userid })
    .then(user => {
        if(!user) {
            console.log('User does not exist');
            resp.render('login');
        }
        else {
            if(user.password != password) {
                console.log('Wrong Password');
                resp.render('login');
            }
            else {
                console.log('Login Successfull');
                req.session.login = user.type;
                req.session.userid = user.facultyid;
                
                resp.render('dashboard', {
                    login: user.type,
                    userid: user.facultyid
                });
            }
        }
    })
    .catch(err => console.log(err));
});

//Logout Event
router.get('/logout', (req, resp) => {
    console.log(req.session.userid);
    req.session.destroy(err => {
        console.log(err);
    })
    resp.render('login');
});


module.exports = router;