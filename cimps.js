/* ---------------------------------------------+
 * FILE NAME - upnp.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : index.js for CIMPS.            +
 * ---------------------------------------------*/

'use strict';

// upnp port forwarding
var upnp = require('./utilities/upnp.js'); 
// mongoDB
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// express
var express = require('express');
var app = express();


// root route
app.get('/', function(req, res) {
    var responseText = 'Hello World!<br>';
    res.send(responseText);
});

// route that devices will automatically connect and reqister their current ip:port
app.use('/devices', function(req, res) {
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

    // insert into database and response the result
    // 0: fail, 1: success
    // connection url
    var url = 'mongodb://localhost:27017/';
    // use connect method to connect to the server
    mongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connecting to db successfully");

        insertDocument(deviceInfo, db);
    });

    res.send(1); // 1
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(500);
});

app.listen(3000, function() {
    console.log('App listening on port 3000.\n');
});


// used to insert data into db
var insertDocument = function(data, db) {
    return new Promise(function(resolve, reject) {
        // get the documents collection
        var collection = db.collection('documents');
        // insert some documents
        if(data != null) {
            collection.insert(data, function(err, result) {
                assert.equal(err, null);
                assert.equal(3, result.result.n);
                assert.equal(result.ops.length);
                console.log('Insert document successfully');

                resolve(result);
            });
        } else {
            throw new Error('Data is null!');
        }
    });
}