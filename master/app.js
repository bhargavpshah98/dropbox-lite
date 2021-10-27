const expressLayouts=require('express-ejs-layouts');
const express = require('express');
const session=require('express-session');
const passport=require('passport');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const dotenv =require('dotenv').config();

const app=express();

//Express sessions
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//configuring passport
require('./config/passport')(passport);

//Middleware of passport
app.use(passport.initialize());
app.use(passport.session());

//connecting to Mongo
mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>console.log('MongoDb connected!!'))
.catch(err=>console.log(err));

//Printing db
const db=process.env.MongoURI;
console.log("Printing db=",db)

//uploading the file with multer
const multer = require("multer");

//Frontend with EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//BodyParsing
app.use(express.json());
app.use(express.urlencoded({ extented:false}));

//connecting flash
app.use(flash());

//Global variable using flash
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/index',require('./routes/index'));
app.use('/Users',require('./routes/Users'));
app.use('/upload',require('./routes/upload'));
app.use('/delete',require('./routes/delete'));

const PORT = process.env.PORT || 3000;

app.listen(PORT,console.log(`Server has been started`));