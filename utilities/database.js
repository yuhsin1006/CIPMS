/* ---------------------------------------------+
 * FILE NAME - database.js                      +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : collection of functions that do+
 *               operation to the database.     +
 * ---------------------------------------------*/

'use strict'
exports.version = '1.0.3';

// import mongoDB libaraies
var mongoClient = require('mongodb').MongoClient;
var test = require('assert');


// insert a document to database
module.exports.insertDocument = function(dbName, col, data) {
    var dbURL = 'mongodb://localhost:27017/' + dbName; // database url, usually at localhost
    var result = false; // initialize result to false (fail)

    if (data == undefined) { // check whether input data is undefined
        console.log('No data to be added.\n\n');
        return result;
    }

    mongoClient.connect(dbURL, function(err, db) {
        var collection = db.collection(col); // select collection

        // insert a document and return a promise
        collection.insertOne(data)
        .then(function(value) {
            console.log('Insert document successfully.\n\n');
        }, function(reason) {
            // executes when rejected
            console.log('Fail to insert document.\n\n');
        });

        db.close(); // close connection to database
    });

    return result;
}

/* WARNING! This module is still underconstruction! */
module.exports.findDocument = function(dbName, col, cond) {
    var dbURL = 'mongodb://localhost:27017/' + dbName;
    var result;

    if (cond == undefined) {
        throw 'No condition to be referenced.';
    }
    mongoClient.connect(dbURL, function(err, db) {
        var collection = db.collection(col);

        // insert a document and return a promise
        collection.findOne(cond)
        .then(function(value) {
            ;
        }, function(reason) {
            // executes when rejected
            console.log('Fail to insert document.\n\n');
        });

        db.close(); // close connection to database
    });

    return result;
}