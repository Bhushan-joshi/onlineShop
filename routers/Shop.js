const express=require('express');
const Router=express.Router();
const shopController=require('../controller/shopController');

Router.get('/',shopController.getIndex);

Router.get('/product-detail/:productid',shopController.getDetails);

Router.get('/cart',shopController.getCart);
Router.post('/cart',shopController.postCart);
Router.post('/cart-delete-item',shopController.deleteCartItem);

Router.get('/orders',shopController.getOrder);
Router.post('/create-order',shopController.postOrder);

module.exports=Router;