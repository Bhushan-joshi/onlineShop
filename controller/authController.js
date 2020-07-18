const User = require('../models/User');
const crypto = require('bcryptjs');

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: 'auth/signup',
        title: 'Signup',
        Message: req.flash('signupError')
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const compassword = req.body.compassword;
    crypto.genSalt(13).then(salt => {
        crypto.hash(password, salt).then(hash_password => {
            User.findOne({ Email: email }).then(usr => {
                if (usr) {
                    req.flash('signupError', 'User exist with Email. Try with another Email!');
                    return res.redirect('/auth/signup');
                } else {
                    const newUser = new User({
                        Email: email,
                        Password: hash_password,
                        Cart: { items: [] }
                    });
                    newUser.save().then(() => {
                        res.redirect('/auth/login');
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            if (err) { console.log(err); }
        });

    }).catch(err => {
        if (err) { console.log(err); }
    });
};


exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: 'auth/login',
        title: 'Login',
        Message: req.flash('loginError')
    });
};

exports.postLogin = (req, res, next) => {
    const password = req.body.password;
    User.findOne({ Email: req.body.email }).then(user => {
        if (!user) {
            req.flash('loginError', 'Invalid Email or Password!');
            return res.redirect('/auth/login');
        }
        crypto.compare(password, user.Password).then(domatch => {
            if (domatch) {
                req.session.user = user;
                req.session.isLoggedin = true;
                req.session.save(err => {
                    if (err) { console.log(err); }
                    req.flash('successlogin', 'Login Successfully!');
                    res.redirect('/');
                });
            } else {
                req.flash('loginError', 'Invalid Email or Password!');
                res.redirect('/auth/login');
            }
        }).catch(err => {
            if (err) { console.log(err); }
        });
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/auth/login');
    next();
};

