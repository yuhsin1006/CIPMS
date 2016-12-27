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
let db = require('./utilities/database.js');
// express libaraies
let express = require('express');
let app = express();
let path = require('path');
// bodyParser
let bodyParser = require('body-parser');
// authentication module
let auth = require('./utilities/auth.js');


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
    // request body
    // {
    //      fName:  <string>    First Name
    //      lName:  <string>    Last Name
    //      phone:  <string>    telephone number
    //      email:  <string>    email address (used as account)
    //      pwd:    <string>    password
    // }
    let data = req.body;

    /* send json response */
    // response data schema
    // {
    //      result:   <integer>  1: success, 0:fail
    //      message:  <string>   message to user, shown by client app
    // }
    let resData = {
        result: 0,
        message: '系統錯誤，請再試一次'
    };
    db.insertDocument('cimpsDB', 'users', data) // insert document
        .then(() => {
            resData = {
                result: 1,
                message: '註冊成功!'
            };

            // send response
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resData));

            console.log('A user registered successfully\n');
        }, err => {
            resData = {
                result: 0,
                message: '註冊失敗，請再試一次。'
            };

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resData));

            console.log(err);
        });
});

// user login authentication
app.post('/auth', (req, res) => {
    let data = req.body;
    let resData = {
        result: 0, // 1: success, 0:fail
        description: '系統錯誤，請再試一次'
    };
    auth.verify(data.email, data.pwd) // verify email and password then return result
        .then(result => {
            console.log(result);
            if (result.status) {
                resData = {
                    result: 1,
                    message: '認證成功',
                    fName: result.fName
                };

                // send json response
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(resData));
            } else {
                resData = {
                    result: 0,
                    message: '帳號或密碼錯誤'
                };

                // send json response
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(resData));
            }
        }, reason => {
            // send json response
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resData));
            console.log(reason);
        });



});

// route that devices will automatically connect and reqister their current ip:port
app.use('/deviceReg', (req, res) => {
    let resData = {
        result: 0,
        message: 'Under construction.'
    };
    // send json response
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resData));
});

// get device information
app.post('/getDeviceInfo', (req, res) => {
    let resData = {
        result: 0,
        serial: '',
        macAddr: '',
        ipAddr: '',
        port: 1025,
        message: '系統錯誤，請再試一次'
    };

    let data = req.body;
    let queryTarget = {
        serial: data.serial
    };
    db.findDocument('cimpsDB', 'devices', queryTarget)
        .then(result => {
            let resData = {
                result: 1,
                serial: result.serial,
                macAddr: result.mac,
                ipAddr: result.ip,
                port: result.port,
                message: '成功'
            };

            // send json response
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resData));

            console.log('Success');
        }, reason => {
            let resData = {
                result: 0,
                serial: null,
                macAddr: null,
                ipAddr: null,
                port: null,
                message: ''
            };

            // send json response
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resData));

            console.log(reason);
        });
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
            resData = {
                result: 1,
                message: 'Device register successfully'
            };
            console.log('Success\n\n');
        }, err => {
            resData = {
                result: 0,
                message: err
            };
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