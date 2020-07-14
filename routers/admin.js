const express = require('express');
const adminController=require('../controller/adminController');

const Router = express.Router();

Router.get('/add-product', adminController.getAddproduct);

Router.post('/add-porduct',adminController.postAddproduct);
module.exports = Router;