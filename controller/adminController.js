const Product = require('../models/product');


exports.getAddproduct = (req, res, next) => {
    res.render('admin/add-product', { path: '/admin/add-product', title: 'Addproduct' });
};

exports.postAddproduct = (req, res, next) => {
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