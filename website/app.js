var bodyParser = require('body-parser')
var path = require('path');
var mysql = require('mysql');
var http = require('http');
const { check } = require('express-validator/check')
var session = require('express-session');
var express = require('express');
const BlockMusic = require('./blockmusic')

require('dotenv').config();
var app = express();
module.exports = app;

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

var index = require('./routes/index');
var artist = require('./routes/artist');
var listener = require('./routes/listener');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const responseMiddleware = (req, res, next) => {
  return res.json(req.responseValue)
}

app.get('/listener',listener.main);
app.get('/artist',artist.main);
app.get('/',index.main);
app.post('/userLogin',listener.userLogin);
app.post('/artistLogin',artist.artistLogin);
app.post('/getSong',listener.getSong);

app.post('/buy',[check('sender', 'Sender must be a String').exists(),
check('recipient', 'Sender must be a String').exists(),
check('amount', 'Sender must be a Int Value').isInt().exists()
], BlockMusic.newTransaction, responseMiddleware);

app.get('/mine', BlockMusic.mine, responseMiddleware);
app.get('/chain', BlockMusic.getChain, responseMiddleware);

app.listen(6009, function () {
    console.log('App listening on port: 6005');
});
