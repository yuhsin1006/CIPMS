/* ---------------------------------------------+
 * FILE NAME - auth.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : define implementation of       +
 *               authentication procedure.      +
 * ---------------------------------------------*/

'use strict'
exports.version = '1.1.0';

// mongoDB
var mongoClient = require('mongodb').MongoClient;
var test = require('assert');


// compare 
module.exports.verify = function(usrname, pwd) {
    var result = false; // initialize result to fail

    mongoClient.connect('mongodb://localhost:27017/cimpsDB', function(err, db) {
        var collection = db.collection('users');

        // query keywords
        var queryCondition = {
            username: usrname,
            password: pwd
        };
        
        collection.findOne(queryCondition) 
        // promise call back schema: resolve, reject
        .then(function(doc) {
            if (doc != null) { // get data we need or not
                result = true;
                console.log(doc);
            }
        }, function(reason) {
            // executes when rejected
            console.log(reason);
        });

        db.close(); // close connection to database
    });

    return result;
}