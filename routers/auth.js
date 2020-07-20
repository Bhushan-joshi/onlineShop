const express = require('express');
const authController = require('../controller/authController');


const Router = express.Router();

Router.get('/login', authController.getLogin);
Router.post('/login', authController.postLogin);

Router.post('/logout',authController.postLogout);

Router.get('/signup',authController.getSignup);
Router.post('/signup',authController.postSignup);

Router.get('/reset-password',authController.getResetPassword);
Router.post('/reset-password',authController.postResetPassword);

Router.get('/new-password/:token',authController.getNewPassword);
Router.post('/new-password',authController.postNewPassword);





module.exports = Router;