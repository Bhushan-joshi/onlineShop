exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        path: null,
        title: 'pageNotFound', 
        isAuthenticted: req.session.isLoggedin
    });
};

exports.get500 = (error,req, res, next) => {
    res.status(500).render('500', {
        path: null, 
        title: 'pageNotFound', 
        isAuthenticted: req.session.isLoggedin
    });
};