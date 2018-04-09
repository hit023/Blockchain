const bodyParser = require('body-parser')
const mysql = require('mysql');
var http = require('http');
const express = require('express');
var session = require('express-session');
var router = require('./index.js').router;

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

router.get('/artist', function(req,res,next){
    res.render('artist');
});

router.post('/artist', function (req, res) {
    let song = req.body.song;
    q = 'SELECT * FROM `songs` WHERE `name` = ' + connection.escape(song);
    connection.query(q,function(err,rows,fields){
        if (!err)
        {
            console.log("Hey, have some results!");
            res.render('artist', {results : rows, song : song,error : null});
        }
        else
        {
            res.render('artist', {results : null,song : null, error : 'Error encountered in retreiving the results'});
        }
    });
})
