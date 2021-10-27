const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('./../config/auth');

//fetching data
const Files = require('./../models/files');
const User = require('./../models/user');

//Home Page
router.get('/home',(req,res)=>res.render('home'));

//Admin Page
router.get('/admin',ensureAuthenticated,(req,res)=>{
    const user =req.user;
    if(req.user.name == 'admin'){
        User.find({ level: { $ne: 'A' }},(err, output) => {
            Files.find({},(err, data) => {
                    res.render('admin',{
                    user: user,
                    data: data,
                    logins: output
                })
            })
        })

      
    }
    else{
        Files.find({ email : req.user.email },(err, data) => {
            res.render('admin',{
                user: user,
                data: data,
                logins: {}
            })
        })
    }

});
module.exports=router;