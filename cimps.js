/* ---------------------------------------------+
 * FILE NAME - upnp.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : index.js for CIMPS.            +
 * ---------------------------------------------*/

var upnp = require('./utilities/upnp.js'); // upnp port forwarding
var express = require('express');
var app = express();


// root route
app.get('/', function (req, res) {
    var responseText = 'Hello World!<br>';
    res.send(responseText);
});

// route that devices will automatically connect and reqister their current ip:port
app.use('/devices', function (req, res) {
    // Device information object
    // {
    //    mac:      <string>  mac address of remote device
    //    ip:       <string>  ip address
    //    port:     <int>     port
    //    regTime:  <Date>    time that remote device registered
    // }
    var deviceInfo = {
        mac: 1,
        ip: req.connection.remoteAddress,
        port: req.connection.remotePort,
        regTime: Date.now()
    }; // record device information
    console.log(deviceInfo); // log incoming information

    res.status(200).send('success');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Error! Please connect the administrator.');
});

app.listen(3000, function () {
    console.log('App listening on port 3000.\n');
});