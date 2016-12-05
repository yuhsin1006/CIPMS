'use strict'

// mongoDB
var mongoClient = require('mongodb').MongoClient;
var test = require('assert');


function doAuthentication (usrname, pwd) {
    MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
        var collection = db.collection('users');

        // verify username first
        var result = collection.findOne({username: usrname}, function(err, doc) {
            test.equal(null, err);
            db.close();
        });
    });


    console.log(result);
}