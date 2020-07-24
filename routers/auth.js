const express = require('express');
const authController = require('../controller/authController');
const { check, body } = require('express-validator/check');

const Router = express.Router();

Router.get('/login', authController.getLogin);
Router.post('/login',
[
    
],
authController.postLogin);

Router.post('/logout', authController.postLogout);

Router.get('/signup', authController.getSignup);
Router.post('/signup',
[//validating data
    check('email').isEmail([{ domain_specific_validation: false }]).withMessage('Invalid Email !'),
    body('password').isAlphanumeric().isLength({ min: 8 }).withMessage('Password must be of 8 Characters long and Alphanumeric!'),
    body('compassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password fields must match');
        }
        return true;
    })
],
authController.postSignup);

Router.get('/reset-password', authController.getResetPassword);
Router.post('/reset-password', authController.postResetPassword);

Router.get('/new-password/:token', authController.getNewPassword);
Router.post('/new-password', authController.postNewPassword);





module.exports = Router;