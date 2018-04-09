var bodyParser = require('body-parser')
var path = require('path');
var mysql = require('mysql');
var http = require('http');
var express = require('express');
var session = require('express-session');
var app = express();

var routes = require('./routes/index');
var artist = require('./routes/artist');
var listener = require('./routes/listener');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/',routes);
app.use('/artist',artist);
app.use('/listener',listener);

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.get('/', function (req, res) {
    res.render('index');
})

app.listen(5002, function () {
    console.log('App listening on port 5002!')
})
