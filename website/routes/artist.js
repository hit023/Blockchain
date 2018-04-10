var mysql = require('mysql');
var express = require('express');
var router = express.Router();

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

module.exports = router;
