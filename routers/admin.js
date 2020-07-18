const express = require('express');
const adminController=require('../controller/adminController');
const isAuth=require('../util/is_auth');

const Router = express.Router();

Router.get('/add-product',isAuth, adminController.getAddproduct);

Router.post('/add-porduct',isAuth, adminController.postAddproduct);
module.exports = Router;