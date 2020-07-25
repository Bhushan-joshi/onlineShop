const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');
const Key=require('../StripeKey');
const stripe=require('stripe')(Key);//add your private stripe key :)

const Product = require('../models/product');
const Order = require('../models/Order');

exports.getIndex = (req, res, next) => {
    Product.find().then(product => {
        res.render('shop/index', {
            path: '/',
            title: 'Shop',
            prods: product,
            Message: req.flash('successlogin')
        });
    });
};

exports.getDetails = (req, res, next) => {
    Product.findById(req.params.productid).then(product => {
        res.render('shop/product-detail', {
            path: '',
            title: 'Product-detail',
            product: product,
        });
    });
};

exports.getCart = (req, res, next) => {

    let total = 0;
    req.user
        .populate('Cart.items.productid')
        .execPopulate()
        .then(user => {
            const products = user.Cart.items;
            user.Cart.items.forEach(item => {
                total=total+item.quantity * item.productid.Price;
            });
            res.render('shop/cart', {
                path: '/cart',
                title: 'Your Cart',
                products: products,
                total: total,
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {

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

    const productid = req.body.productId;
    req.user.removeCartItem(productid).then(result => {
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    });
};
exports.getOrder = (req, res, next) => {

    Order.find({ 'userid.id': req.user._id }).then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            title: 'Your Orders',
            orders: orders,
        });
    });

};
exports.postOrder = (req, res, next) => {
    req.user
        .populate('Cart.items.productid')
        .execPopulate()
        .then(user => {
            const items = user.Cart.items.map(itm => {
                return { quantity: itm.quantity, product: { ...itm.productid._doc } };
            });
            const order = new Order({
                userid: {
                    name: req.user.Email,
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


exports.getInvoice = (req, res, next) => {
    const invoiceID = req.params.orderid;
    Order.findById(invoiceID).then((order) => {
        if (!order) {
            return next(new Error(''));
        }
        if (order.userid.id.toString() !== req.user._id.toString()) {
            return next(new Error(''));
        }
        const invoiceName = 'invoice-' + invoiceID + '.pdf';
        const invoicePath = path.join(__dirname, '../data', 'Invoices', invoiceName);


        const pdfDoc=new pdfDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline;filename="' + invoiceName + '"');
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(30).text('Invoice',{underline:true,});
        pdfDoc.fontSize(22).text(order.userid.name +'\n' + "ODID = "+ invoiceID);
        pdfDoc.text('---------------------------------------------');
        let total=0;
        order.products.forEach((prod,index)=>{
            total =total+ prod.product.Price*prod.quantity;
            pdfDoc.fontSize(18).text(
                index + ' )  '+prod.product.Title+ ' - '+ prod.product.Price +' * '+prod.quantity
            );
        });
        pdfDoc.text('total price ='+total+ '\n');
        pdfDoc.end();

        /* sending all data at same time this is not good way of 
        sending data */
        // fs.readFile(invoicePath,(error,data)=>{
        //     if(error){
        //         return next(error);
        //     }
        //     res.setHeader('Content-Type','application/pdf');
        //     res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"');
        //     res.send(data);
        // });

        /* we sends data in form of chuncks which is good way */
        // const data = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline;filename="' + invoiceName + '"');
        // data.pipe(res);

    }).catch((err) => {
        return next(new Error(''));
    });

};



exports.getCheckout=(req,res,next)=>{
    let total = 0;
    let products;
    req.user
        .populate('Cart.items.productid')
        .execPopulate()
        .then(user => {
            products = user.Cart.items;
            user.Cart.items.forEach(item => {
                total=total+item.quantity * item.productid.Price;
            });
            return stripe.checkout.sessions.create({
                payment_method_types:['card'],
                line_items:products.map(p=>{
                    return {
                        name:p.productid.Title,
                        description:p.productid.Description,
                        amount:p.productid.Price *100,
                        currency:'INR',
                        quantity:p.quantity,
                    };
                }),
                success_url:req.protocol+'://'+req.get('host')+'/checkout/success',
                cancel_url:req.protocol+'://'+req.get('host')+'/checkout/cancel'
            });
            
        }).then(session=>{
            // console.log(session)
            res.render('shop/checkout', {
                path: '/cart',
                title: 'checkout',
                products: products,
                total: total,
                sessionid:session
            });
        })
        .catch(err => {
            // return next(err);
            console.log(err);
        });
};