const express=require('express');
const Router=express.Router();
const shopController=require('../controller/shopController');
const isAuth= require('../util/is_auth');

Router.get('/', shopController.getIndex);

Router.get('/product-detail/:productid', shopController.getDetails);

Router.get('/cart',isAuth, shopController.getCart);
Router.post('/cart',isAuth, shopController.postCart);
Router.post('/cart-delete-item',isAuth, shopController.deleteCartItem);

Router.get('/orders',isAuth, shopController.getOrder);
Router.post('/create-order',isAuth, shopController.postOrder);

module.exports=Router;