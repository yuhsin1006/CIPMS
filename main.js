/* ---------------------------------------------+
 * FILE NAME - main.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : index.js for CIMPS.            +
 * ---------------------------------------------*/

'use strict';

// upnp port forwarding
//var upnp = require('./utilities/upnp.js');
// import mongoDB libaraies
var mongo = require('./utilities/database.js');
// express libaraies
var express = require('express');
var app = express();
var path = require('path');
// bodyParser
var bodyParser = require('body-parser');
// authentication module
var auth = require('./utilities/auth.js');


// set folder 'public' as public access folder
app.use(express.static('public'));
// use body-parser to parse body to json format
app.use(bodyParser.json());

// to login page
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname+'/public/login.html'));
});

// user login authentication
app.post('/auth', function(req, res) {
    var data = req.body;
    var result = auth.verify(data.email, data.pwd); // verify email and password then return result
    console.log(result);

    // send json response
    res.setHeader('Content-Type', 'application/json');
    if (result == true) {
        res.send(JSON.stringify({ result: 1 })); // 1 indicates success
    } else {
        res.send(JSON.stringify({ result: 0 })); // 0 indicates authentication fail
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
    //    belongTo: <string>  
    // }
    // record device information
    var deviceInfo = {
        serial: 1,
        mac: 1,
        ip: req.connection.remoteAddress,
        port: req.connection.remotePort,
        regTime: Date.now(),
        belongTo: null
    }; 
    console.log(deviceInfo); // log incoming information

    // insert into database and return result
    var result = mongo.insertDocument('cimpsDB', 'devices', deviceInfo);
    // send json response
    res.setHeader('Content-Type', 'application/json');
    if (result == true) {
        res.send(JSON.stringify({ result: 1 })); // success
    } else {
        res.send(JSON.stringify({ result: 0 })); // fail to insert doc
    }
});

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.sendStatus(500);
});

app.listen(3000, function() {
    console.log('App listening on port 3000.\n');
});