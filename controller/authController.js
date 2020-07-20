const User = require('../models/User');
const crypto = require('bcryptjs');
const crypt = require('crypto');
const mail=require('../email');

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
    User.findOne({ Email: email }).then((user) => {
        if (user) {
            req.flash('signupError', 'User exist with Email. Try with another Email!');
            return res.redirect('/auth/signup');
        }
        else {
            crypto.genSalt(13).then(salt => {
                crypto.hash(password, salt).then(hashPassword => {
                    const newUser = new User({
                        Email: email,
                        Password: hashPassword,
                        Cart: { items: [] }
                    });
                    newUser.save().then(() => {
                        res.redirect('/auth/login');
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
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


exports.getResetPassword = (req, res, next) => {
    res.render('auth/resetpassword', {
        path: '',
        title: 'Reset password',
        Message: req.flash('resetError')
    });
};

exports.postResetPassword = (req, res, next) => {
    const email=req.body.email;
    User.findOne({ Email:email  }).then(user => {
        if (!user) {
            req.flash('resetError', 'check Email,No user with this Email');
            res.redirect('/auth/reset-password');
        } else {
            crypt.randomBytes(64, function (error, buffer) {
                if (error) {
                    console.log(error);
                    req.flash('resetError', 'Something went wrong !');
                    res.redirect('/auth/reset-password');
                }
                const token= buffer.toString('hex');
                user.Token=token;
                user.TokenExpireDate=Date.now() + 900000;
                user.save();
                req.flash('successlogin','Password reset link send to your mail');
                res.redirect('/');
                mail.sendMail({
                    to:email,
                    from:'mail@Ebuy.com',
                    subject:'Password reset',
                    text:'Hi User! We encounter that you send  a password reset request to us. please goto following link to reset your password',
                    html:`<div>
                    <h1>Password reset</h1>
                    <a href='http://localhost:3000/auth/new-password/${token}'>Click here</a>
                    </div>`
                }).then(()=>{
                    console.log('mail send');
                });
            });
        }
    });
};

exports.getNewPassword=(req,res,next)=>{
    const token=req.params.token;
    User.findOne({Token:token,TokenExpireDate:{$gt:Date.now()}})
    .then(user=>{
        res.render('auth/reset',{
            path:'',
            title:'New Password',
            Message:'',
            email:user._id.toString()
        });
    }).catch((err)=>{
        console.log(err);
    });
};

exports.postNewPassword=(req,res,next)=>{
    const id=req.body.email;
    const password=req.body.password;
    User.findById(id).then(user=>{
        crypto.genSalt(13).then(salt=>{
            crypto.hash(password,salt).then(hashPassword=>{
                user.Password=hashPassword;
                user.Token=undefined;
                user.TokenExpireDate=undefined;
                user.save().then(()=>{
                    res.redirect('/auth/login');
                });
            }).catch((err)=>{});
        }).catch((err)=>{});
    }).catch((err)=>{});
};