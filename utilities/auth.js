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
module.exports.verify = function (usrname, pwd) {
    return new Promise((resolve, reject) => {
        mongoClient.connect('mongodb://localhost:27017/cimpsDB')
            .then(db => {
                var collection = db.collection('users');

                // data to be found
                var queryCondition = {
                    email: usrname
                };
                collection.findOne(queryCondition)
                    // promise call back schema: resolve, reject
                    .then(doc => {
                        if (doc != null) { // get data we need or not
                            if (doc.pwd == pwd) {
                                result = true;
                            }
                            db.close();
                        }
                    }, reason => {
                        reject(new Error(reason));
                    });
            }, err => {
                reject(new Error(err));
                return;
            });
    });
}