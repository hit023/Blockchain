var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'blockchain'
});

connection.connect(function(err){
    if(!err)
        console.log("Database is connected.\n");
    else
        console.log("Error connecting database.\n");
});

global.db = connection;

exports.getSong = function (req, res) {
    let song = req.body.song;
    q = 'SELECT * FROM `songs` WHERE `name` like ' + db.escape('%' + song + '%');
    db.query(q,function(err,rows,fields){
        if (!err)
        {
            res.render('listener', {user : req.session.name,message : "",success : req.session.success,results : rows, song : song,error : null});
        }
        else
        {
            console.log(err);
            res.render('listener', {user : req.session.name,success : req.session.success, results : null,song : null, error : 'Error encountered in retreiving the results'});
        }
    });
}

exports.main = function(req, res, next){
    let name = req.session.name;
    if(name == undefined)
    {
        req.session.name = 'Guest';
        res.render('listener', {user : req.session.name, success : req.session.success, message : ""});
    }
    else {
        res.render('listener', {user : req.session.name, success : req.session.success, results : null, song : null,error : null});
    }
}

exports.userLogin = function(req,res,next){
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
            res.render('listener', {user : req.session.name, success : req.session.success, results : null, song : null,error : null});
        }
        else
        {
            var message = 'Wrong Credentials.';
            req.session.success = false;
            req.session.name = 'Guest';
            console.log(message);
            res.render('listener',{user : req.session.name, message: message, success : req.session.success});
        }
    });
}
