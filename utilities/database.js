'use strict'
exports.version = '1.0.0';

// mongoDB
var mongoClient = require('mongodb').MongoClient;
var test = require('assert');


module.exports.insertDocument = function (dbName, col, data) {
    var dbURL = 'mongodb://localhost:27017/' + dbName;
    var result = false; // initialize result to fail

    if (data == undefined) {
        throw 'No data to be added.';
    }
    mongoClient.connect(dbURL, function(err, db) {
        var collection = db.collection(col);

        // insert a document and return a promise
        var promise = collection.insertOne(data, function(err, doc) {
            test.equal(null, err);
            db.close();
        });
    });

    return result;
}


module.exports.findDocument = function (dbName, col, cond) {
    var dbURL = 'mongodb://localhost:27017/' + dbName;
    var result;

    if (cond == undefined) {
        throw 'No condition to be referenced.';
    }
    mongoClient.connect(dbURL, function(err, db) {
        var collection = db.collection(col);

        // insert a document and return a promise
        var promise = collection.findOne(cond).then(function(doc) {
            result = doc;
            db.close();
        });
    });

    return result;
}