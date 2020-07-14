const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//user models
const ShopRoute = require('./routers/Shop');
const AdminRoute = require('./routers/admin');
const User=require('./models/User');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next)=>{
    User.findById({_id:'5f05c27fe7424c8ccaf41e39'}).then(User=>{
        req.user= User;
        next();
    });
});
//Routes//
app.use(ShopRoute);
app.use('/admin', AdminRoute);
//404 Page
app.use((req, res, next) => {
    res.render('404', { path: null, title: 'pageNotFound' });
});
//creating a user
// const user=new User({
//     Name: 'Bhushan',
//     Password: 'test123',
//     Cart:[],
// });
// user.save();



//Database connection
mongoose.connect("mongodb://localhost:27017/Shop?readPreference=primary&appname=MongoDB%20Compass&ssl=false", { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected");
});

//server Start
app.listen(3000, () => {
    console.log('server started @ http://127.0.0.1:3000');
});