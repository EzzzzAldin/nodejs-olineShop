const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/online-shop';

const bcrybt = require('bcrypt')

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('user', userSchema);

exports.createNewUser = (username, email, password) => {
    
    return new Promise((resolve, reject) => {
        // DB connect
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Chake if email exits
           return User.findOne({email: email});
        }).then(user => {
            if(user) {
                // If the email is fined in DB
                mongoose.disconnect();
                reject('email is used');
            } else {
                // email is not fined in DB And locked Passwaord
                return bcrybt.hash(password, 10)
            }    
        }).then(hashedPassword => {
            // Save new User Data in collection user in DB 
            let user = new User({
                username: username,
                email: email,
                password: hashedPassword
            })
            return user.save();
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        })
    })
};

exports.login = (email, password) => {


    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Chake if email exits
           return User.findOne({email: email});
        }).then(user => {
            // email is not fined in DB And locked Passwaord
            if (!user) {
                mongoose.disconnect();
                reject('there is no user matches this email');
            } else {
                // Check Password
                bcrybt.compare(password, user.password).then(same => {
                    // Password is not same Password in DB
                    if(!same) {
                        mongoose.disconnect();
                        reject('the Password is incorrect');
                    } else {
                        mongoose.disconnect();
                        resolve({
                            id: user.email,
                            isAdmin: user.isAdmin
                        });
                    }
                })
            }
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};