const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodbsession = require('connect-mongodb-session')(session);
const flash = require('connect-flash');


//user models
const ShopRoute = require('./routers/Shop');
const AdminRoute = require('./routers/admin');
const authRoute = require('./routers/auth');
const User = require('./models/User');

const MONGOURL = "mongodb://localhost:27017/Shop?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const app = express();

const store = new mongodbsession({
    uri: MONGOURL,
    conllection: 'session'
});



app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "this is most secret thing",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));


//setting up default User
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById({ _id: req.session.user._id }).then(user => {
        req.user = user;
        next();
    });
});

app.use((req, res, next) => {
    res.locals.isAuthenticted = req.session.isLoggedin;
    next();
});
app.use(flash());
//Routes//
app.use('/auth', authRoute);
app.use(ShopRoute);
app.use('/admin', AdminRoute);

//404 Page

app.use((req, res, next) => {
    res.render('404', { path: null, title: 'pageNotFound', isAuthenticted: req.session.isLoggedin });
});

//Database connection
mongoose.connect(MONGOURL, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected");
});

//server Start
app.listen(3000, () => {
    console.log('server started @ http://127.0.0.1:3000');
});