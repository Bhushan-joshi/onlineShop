const Product = require('../models/product');


exports.getAddproduct = (req, res, next) => {
   
    res.render('admin/add-product', { 
        path: '/admin/add-product',
        title: 'Addproduct' ,
    }
);
};

exports.postAddproduct = (req, res, next) => {
    
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if(!image){
        return res.redirect('/admin/add-product');
    }
    const imageURL=req.file.path;

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