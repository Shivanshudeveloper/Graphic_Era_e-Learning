// Bring Exrpess
const express = require('express');
const router = express.Router();
// User Module
const User = require('../models/Users');
// Bcrypt for password encryption 
const bcrypt = require('bcryptjs');
// Passport for authentication
const passport = require('passport');

// Login
router.get('/login', (req, res) => {
    res.render('login')
})

// Register
router.get('/register', (req, res) => {
    res.render('register')
})


// Register Handler
router.post('/register', (req, res) => {
    const { name, email, admission,  password, password2 } = req.body
    let errors = [];
    if (!name || !email || !password || !password || !password2 || !admission) {
        errors.push({ msg: 'Please enter all fields' });
    }
    // Password Check
    if (password !== password2) {
        errors.push({ msg: 'Password dose not match' })
    }
    // Password Length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 character' })
    }

    if (errors.length > 0) {
        res.render('register', {
          errors,
          name,
          admission,
          email,
          password,
          password2
        });
    } else {
        User.findOne( {"$or" : [{email : email}, {admission : admission}]} )
            .then(user => {
                if (user) {
                    errors.push({ msg: `Email or Admission already exist ` })
                    res.render('register', {
                        errors,
                        name,
                        admission,
                        email,
                        password,
                        password2
                    })
                }
                else {
                    const newUser = new User({
                        name,
                        admission,
                        email,
                        password,
                    })
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set Password to hash
                        newUser.password = hash
                        // Save User
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You Are Successfully Registered')
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))
                    }))
                }
        })
    }
})


// Login Handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})
// LogOut Handle
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/users/login')
})


// Exporting Module
module.exports = router