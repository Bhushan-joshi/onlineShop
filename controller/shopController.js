const Product = require('../models/product');

const Order = require('../models/Order');

exports.getIndex = (req, res, next) => {
    Product.find().then(product => {
        res.render('shop/index', {
            path: '/',
            title: 'Shop',
            prods: product,
        isAuthenticted:req.session.isLoggedin
        });
    });
};

exports.getDetails=(req,res,next)=>{
    Product.findById(req.params.productid).then(product=>{
        res.render('shop/product-detail', {
            path: '',
            title: 'Product-detail',
            product: product,
        isAuthenticted:req.session.isLoggedin
        });
    });
};

exports.getCart = (req, res, next) => {
    if (!req.session.isLoggedin) {
        return res.redirect('/auth/login');
    }
    const totalarr = [];
    let total = 0;
    req.user
        .populate('Cart.items.productid')
        .execPopulate()
        .then(user => {
            const products = user.Cart.items;
            user.Cart.items.forEach(item => {
                totalarr.push(item.quantity * item.productid.Price);
            });
            for (let i = 0; i < totalarr.length; i++) {
                total = total + totalarr[i];
            }
            res.render('shop/cart', {
                path: '/cart',
                title: 'Your Cart',
                products: products,
                total:total,
        isAuthenticted:req.session.isLoggedin
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    if (!req.session.isLoggedin) {
        return res.redirect('/auth/login');
    }
    const prodid = req.body.productId;
    Product.findById(prodid).then(productid => {
        return req.user.addToCart(productid);
    }).then(result => {
        //console.log(result);
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);

    });
};

exports.deleteCartItem = (req, res, next) => {
    if (!req.session.isLoggedin) {
        return res.redirect('/auth/login');
    }
    const productid = req.body.productId;
    req.user.removeCartItem(productid).then(result => {
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    });
};
exports.getOrder = (req, res, next) => {
    if (!req.session.isLoggedin) {
        return res.redirect('/auth/login');
    }
    Order.find({ 'userid.id': req.user._id }).then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            title: 'Your Orders',
            orders: orders,
        isAuthenticted:req.session.isLoggedin
        });
    });

};
exports.postOrder = (req, res, next) => {
    if (!req.session.isLoggedin) {
        return res.redirect('/auth/login');
    }
    req.user
        .populate('Cart.items.productid')
        .execPopulate()
        .then(user => {
            const items = user.Cart.items.map(itm => {
                return { quantity: itm.quantity, product: { ...itm.productid._doc } };
            });
            const order = new Order({
                userid: {
                    name: req.user.Name,
                    id: req.user
                },
                products: items
            });
            return order.save();
        }).then(result => {
            return req.user.clearCart();
        }).then(() => {
            res.redirect('/orders');
        }).catch((err) => {
            console.log(err);
        });
};