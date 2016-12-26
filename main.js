/* ---------------------------------------------+
 * FILE NAME - main.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : index program for CIMPS.       +
 * ---------------------------------------------*/

'use strict';

// upnp port forwarding
//var upnp = require('./utilities/upnp.js');
// import mongoDB libaraies
var db = require('./utilities/database.js');
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
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});

// handle sign up process form user
app.post('/userSignup', (req, res) => {
    var data = req.body;

    /* send json response */
    // response data schema
    // {
    //      result:   <integer>  1: success, 0:fail
    //      message:  <string>   message to user, shown by client app
    // }
    var resData = {
        result: 0,
        message: '錯誤。'
    };
    db.insertDocument('cimpsDB', 'users', data) // insert document
        .then(() => {
            resData = {
                result: 1,
                message: '註冊成功!'
            };

            console.log('Success\n\n');
        }, err => {
            resData = {
                result: 0,
                message: '註冊失敗，請再試一次。'
            };

            console.log(err);
        });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resData));
});

// user login authentication
app.post('/auth', (req, res) => {
    let data = req.body;
    let resData = {
        result: 0, // 1: success, 0:fail
        description: '錯誤，請再試一次'
    };
    auth.verify(data.email, data.pwd) // verify email and password then return result
        .then(result => {
            console.log(result);
            if (result.status) {
                resData = {
                    result: 1,
                    message: '認證成功'
                };
            } else {
                resData = {
                    result: 0,
                    message: '帳號或密碼錯誤'
                };
            }
        }, reason => {
            console.log(reason);
        });


    // send json response
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resData));
});

// route that devices will automatically connect and reqister their current ip:port
app.use('/deviceReg', (req, res) => {
    resData = {
        result: 0,
        message: 'Under construction.'
    };
    // send json response
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resData));
});

// route that devices will automatically connect and reqister their current ip:port
app.use('/devices', (req, res) => {
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
    let resData;
    db.insertDocument('cimpsDB', 'devices', deviceInfo)
        .then(() => {
            resData = { result: 1 };
            console.log('Success\n\n');
        }, err => {
            resData = { result: 0 };
            console.log(err);
        });

    // send json response
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resData));
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.sendStatus(500);
});

app.listen(3000, () => {
    console.log('App listening on port 3000.\n');
});