'use strict'
exports.version = '1.0.0';

// mongoDB
var mongoClient = require('mongodb').MongoClient;
var test = require('assert');


// compare 
module.exports.verify = function (usrname, pwd) {
    var result = false; // initialize result to fail

    mongoClient.connect('mongodb://localhost:27017/cimpsDB', function(err, db) {
        var collection = db.collection('users');

        try {
            // verify username first
            var promise = collection.findOne({
                    username: usrname,
                    password: pwd
                }, function(err, doc) {
                    test.equal(null, err);
                    db.close();
                });
            
            promise.done(function() {
                result = true;
            });
            promise.fail(function() {
                throw('Not found');
            });
        } catch (err) {
            console.log(err.name, err.message);
        }
    });

    return result;
}