const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

//Database Config
const db = require('./config/keys').MongoURI;

//Connect to MongoDB
mongoose.connect(db, { useNewUrlParser : true, useUnifiedTopology: true })
.then(console.log('MongoDB connected'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.json({limit: '50mb', extended: true}),express.urlencoded({ limit: '1024mb', extended:true }));

//Session
app.use(session({
    secret: 'secret',
    resave: false,
    cookie: { maxAge: 4 * 60 * 60 * 1000 },
    saveUninitialized: true
}));

//Routes
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
app.use('/courses', require('./routes/courses'));
app.use('/faculty', require('./routes/faculty'));

//For Static Files
var path = require('path');
app.use(express.static(__dirname + '/assets'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));