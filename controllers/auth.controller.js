const authModel = require('../models/auth.model');
// Init Result express-validator
const validationResult = require('express-validator').validationResult;


exports.getSignup = (req, res) => {
    res.render('signup', {
        pageTitle: 'Signup',
        // Show Error in Page
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false
    });
};


exports.postSignup = (req, res) => {
    // Check if not found Error
    if( validationResult(req).isEmpty()) {
        // Create New Account
        authModel.createNewUser(req.body.username, req.body.email, req.body.password)
        .then(() => res.redirect('/login'))
        .catch(err => {
            console.log(err);
            res.redirect('/signup')
        });
    } else {
        req.flash('validationErrors', validationResult(req).array());
        res.redirect('/signup');
    }
};

exports.getLogin = (req, res) => {
    res.render('login', {
        pageTitle: 'Login',
        // Show Error auth in Login Page
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false
    });
};

exports.postLogin = (req, res) => {
    // Check if found Error
    if( validationResult(req).isEmpty()) {
        // Cheak Compar input Data and DataBase
        authModel
            .login(req.body.email, req.body.password)
            .then(result => {
                req.session.userId = result.id;
                req.session.isAdmin = result.isAdmin;
                res.redirect('/');
            })
            .catch(err => {
                // Take Error to Enter in Falsh Session
                req.flash('authError', err);
                res.redirect('/login')
            });
    } else {
        req.flash('validationErrors', validationResult(req).array());
        res.redirect('/login')
    }
};

exports.logout = (req, res) => {
    // Delete user of Session DB
    req.session.destroy(() => {
        res.redirect('/')
    });
};
