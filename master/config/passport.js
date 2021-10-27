const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


//User Model
const User = require('./../models/user');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy( {usernameField: 'email'}, (email, password, done) => {
            //verifying User
            User.findOne( { email: email} )
            .then(user => {
                if(!user){
                    return done(null, false, { message: 'The email is not registered'});
                }

                //Verifying Password
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null, false, { message: 'Password is incorrect, please try again'});
                    }
                });
            })
            .catch( err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}