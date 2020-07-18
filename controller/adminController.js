const Product = require('../models/product');


exports.getAddproduct = (req, res, next) => {
    if (!req.session.isLoggedin) {
        return res.redirect('/auth/login');
    }
    res.render('admin/add-product', { 
        path: '/admin/add-product',
        title: 'Addproduct' ,
        isAuthenticted:req.session.isLoggedin
    }
);
};

exports.postAddproduct = (req, res, next) => {
    if (!req.session.isLoggedin) {
        return res.redirect('/auth/login');
    }
    const title = req.body.title;
    const imageURL = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        Title:title,
        Price: price,
        Imageurl:imageURL,
        Description:description
    });
    product.save().then(
    );
    res.redirect('/');
};