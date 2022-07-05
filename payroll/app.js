const port = process.env.PORT || 8080;

var express = require('express');
var expressLayouts = require('express-ejs-layouts')
var path = require('path');

var createError = require('http-errors');

var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var mysql = require('mysql');


var conn  = require('./lib/db');
var app = express();



app.use(expressLayouts)
app.set('layout', './layouts/layout')
//routes

var homeRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var cycleRouter = require('./routes/paycycle');
var viewcycleRouter = require('./routes/viewpaycycle');
var addsalaryRouter = require('./routes/addsalary');
var depRouter = require('./routes/dep');
var addempRouter = require('./routes/addemp')
var timeRouter = require('./routes/overtime')
var sickRouter = require('./routes/sickdays')


// Setup the Views Templating Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/images', express.static(__dirname + 'public/images'))


app.use(cookieParser());
 app.use(session({ 
     secret: 'secREt$#code$%3245',
     resave: false,
     saveUninitialized: true,
     cookie: { maxAge: 100000 }
 }))
 

app.use(flash());



app.use('/', homeRouter);
app.use('/admin', adminRouter);
app.use('/paycycle', cycleRouter);
app.use('/viewpaycycle', viewcycleRouter);
app.use('/addsalary', addsalaryRouter);
app.use('/dep', depRouter);
app.use('/addemp',addempRouter)
app.use('/overtime', timeRouter);
app.use('/sickdays', sickRouter)

app.listen(port, () => console.log(`Listening on port ${port}..`));

module.exports = app;