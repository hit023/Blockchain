var bodyParser = require('body-parser')
var path = require('path');
var mysql = require('mysql');
var http = require('http');
var express = require('express');
//var expressValidator = require('express-validator');
var app = express();
var session = require('express-session');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

var routes = require('./routes/index');
var artist = require('./routes/artist');
var listener = require('./routes/listener');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//app.use(expressValidator());
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/',routes);
app.use('/artist',artist);
app.use('/listener',listener);

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/stream', function(req,res,next){
    let song_id = req.query.id;
});

app.post('/login', function(req,res,next){
    var message = '';
    var sess = req.session;
    let name = req.body.name;
    let pass = req.body.password
    var q = 'SELECT * FROM `users` WHERE `name` = ' + db.escape(name) + ' and `password` = ' + db.escape(pass);
    db.query(q,function(err, results){
        if(!err && results.length)
        {
            req.session.name = results[0].name;
            req.session.password = results[0].password;
            req.session.balance = results[0].balance;
            req.session.success = true;
            console.log("balance: " + req.session.balance);
            console.log('succ: '+ req.session.success);
            res.render('artist', {success : req.session.success, results : null, song : null,error : null});
        }
        else if(err)
        {
            console.log(err);
            message = 'Wrong Credentials.';
            req.session.success = false;
            res.render('artist',{message: message, success : req.session.success});
        }
    });
});

app.post('/getSong', function (req, res) {
    let song = req.body.song;
    q = 'SELECT * FROM `songs` WHERE `name` = ' + db.escape(song);
    db.query(q,function(err,rows,fields){
        if (!err)
        {
            res.render('artist', {message : "",success : 1,results : rows, song : song,error : null});
        }
        else
        {
            res.render('artist', {success : 1, results : null,song : null, error : 'Error encountered in retreiving the results'});
        }
    });
})

app.listen(5030, function () {
    console.log('App listening on port: 5022');
});
