const BlockMusic = require('../blockmusic')

const responseMiddleware = (req, res, next) => {
  return res.json(req.responseValue)
}

exports.artistLogin = function(req,res,next){
    var message = '';
    var sess = req.session;
    let name = req.body.name;
    let pass = req.body.password
    var q = 'SELECT * FROM `artists` WHERE `name` = ' + db.escape(name) + ' and `password` = ' + db.escape(pass);
    db.query(q,function(err, results){
        if(!err && results.length)
        {
            req.session.name = results[0].name;
            req.session.password = results[0].password;
            req.session.balance = results[0].balance;
            req.session.success = true;
            res.render('artist', {user : req.session.name, success : req.session.success, results : null, song : null,error : null});
        }
        else
        {
            var message = 'Wrong Credentials.';
            req.session.success = false;
            req.session.name = 'Guest';
            console.log(message);
            res.render('artist',{user : req.session.name, message: message, success : req.session.success});
        }
    });
}

exports.getTransactions = function(req, res, next){
    var chain = BlockMusic.blockchain.chain;
    console.log(chain);
    res.send(chain);
}

exports.main = function(req, res, next) {
    let name = req.session.name;
    if(name == undefined)
    {
        req.session.name = 'Guest';
        //console.log("hello");
        res.render('artist',{user : req.session.name, success : req.session.success, message : ''});
    }
}
