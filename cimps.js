/* ---------------------------------------------+
 * FILE NAME - upnp.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : index.js for CIMPS.            +
 * ---------------------------------------------*/

'use strict';

// upnp port forwarding
//var upnp = require('./utilities/upnp.js'); 
// mongoDB
var mongo = require('./utilities/database.js');
// express
var express = require('express');
var app = express();
var path = require('path');
// bodyParser
var bodyParser = require('body-parser');
// authentication
var auth = require('./utilities/auth.js');


// set folder 'public' as public
app.use(express.static('public'));
// use body-parser to parse body with json file
app.use(bodyParser.json());

// to login page
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname+'/public/login.html'));
});

// app authentication
app.post('/auth', function(req, res) {
    var data = req.body;
    var result = auth.verify(data.email, data.pwd);
    
    console.log(result);
    res.setHeader('Content-Type', 'application/json');
    if (result == true) {
        res.send(JSON.stringify({ result: 1 })); // 1 indicates true
    } else {
        res.send(JSON.stringify({ result: 0 }));
    }
});

// route that devices will automatically connect and reqister their current ip:port
app.use('/devices', function(req, res) {
    // Device information object
    // {
    //    serial:   <string>  product serial number
    //    mac:      <string>  mac address of remote device
    //    ip:       <string>  ip address
    //    port:     <int>     port
    //    regTime:  <Date>    time that remote device registered
    // }
    var deviceInfo = {
        serial: 1,
        mac: 1,
        ip: req.connection.remoteAddress,
        port: req.connection.remotePort,
        regTime: Date.now()
    }; // record device information
    console.log(deviceInfo); // log incoming information

    // insert into database and response the result
    // connection url
    // var url = 'mongodb://localhost:27017/cimpsDB';
    // // use connect method to connect to the server
    // mongoClient.connect(url, function(err, db) {
    //     assert.equal(null, err);
    //     console.log("Connecting to db successfully");

    //     insertDocument(deviceInfo, db);
    //     
    //     res.sendStatus(200);
    // });

    mongo.insertDocument('cimpsDB', 'devices', deviceInfo);
    console.log(mongo.findDocument('cimps', 'devices', {serial: 1}));
    res.sendStatus(200); // 0: fail, 1: success
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(500);
});

app.listen(3000, function() {
    console.log('App listening on port 3000.\n');
});