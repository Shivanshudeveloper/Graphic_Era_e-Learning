const express = require('express');
const router = express.Router();

//Dashboard
router.get('/', (req, resp) => resp.render('dashboard'));

//Courses
router.get('/courses', (req, resp) => resp.render('courses'));

//Course Upload
router.get('/newcourse', (req, resp) => resp.render('newcourse'));

module.exports = router;