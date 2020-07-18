const express = require('express');
const authController = require('../controller/authController');


const Router = express.Router();

Router.get('/login', authController.getLogin);
Router.post('/login', authController.postLogin);

Router.post('/logout',authController.postLogout);

Router.get('/signup',authController.getSignup);
Router.post('/signup',authController.postSignup);


module.exports = Router;