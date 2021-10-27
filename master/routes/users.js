const passport=require('passport');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');

const User = require('./../models/user');

router.get('/login',(req,res)=>res.render('login'));

router.get('/register',(req,res)=>res.render('register'));

router.post('/register', (req,res)=>{
    const { name, email, password, password2} = req.body;
    let errors = [];

    if(!name || !email || !password ||!password2){
        errors.push({ msg:'Please fill in all fields!' });
    }

    if(password != password2){
        errors.push({msg: 'Passwords do not match!'});
    }

    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters'});
    }


    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        //Validation Passed
        User.findOne({ email:email })
        .then(user => {
            //user exists
            if(user){
                errors.push({ msg:'Email is already registered' });
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
            });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                    level: 'U'
                });

                //Hashing password
                console.log("Printi values = ",name ," email ",email);
                bcrypt.genSalt(10, (err,salt) => 
                   bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if(err) throw err;
                        //set password to hashed
                        newUser.password=hash;
                        //saving the user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg','You have now registered');
                            res.redirect('/Users/login');
                        })
                        .catch(err=>console.log(err));

                   }))
            }
        });
    }
});

//Login with passport
router.post('/login', (req,res, next) => {
    passport.authenticate('local',{
        successRedirect: '/index/admin',
        failureRedirect: '/Users/login',
        failureFlash: true
    })(req, res, next);
});

//logout
router.get('/logout',(req,res,next) => {
    req.logout();
    req.flash('success_msg','You are Logged out');
    res.redirect('/Users/login');
});
module.exports=router;