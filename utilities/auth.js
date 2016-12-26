/* ---------------------------------------------+
 * FILE NAME - auth.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : define implementation of       +
 *               authentication procedure.      +
 * ---------------------------------------------*/

'use strict'
exports.version = '2.0.0';

// mongoDB library
let MongoClient = require('mongodb').MongoClient;


// compare 
async function verify(mail, pwd) {
    // check input data
    if (!mail || !pwd) {
        throw new Error('Input data is invalid.');
    }

    // establish connection
    let connection;
    try {
        connection = await MongoClient.connect(`mongodb://localhost:27017/cimpsDB`);
    } catch (connectionError) {
        // handle error when connection failed
        throw new Error('Database connection error');
    }

    // select collection and insert data
    let collection = connection.collection('users');
    // query criteria
    let queryTarget = {
        email: mail
    };
    // authentication result
    let result = {
        status: false,
        description: ''
    };
    try {
        await collection.findOne(queryTarget)
            .then(doc => {
                if (doc) { // check whether doc exists
                    if (doc.pwd == pwd) {
                        result = {
                            status: true,
                            description: 'Success.',
                            fName: doc.fName
                        };
                    } else {
                        result = {
                            status: false,
                            description: 'Password is not correct.'
                        };
                    }
                } else {
                    result = {
                        status: false,
                        description: 'Email is not found.'
                    };
                }
            }, reason => {
                result = {
                    status: false,
                    description: reason
                };
            });
    } catch (queryError) {
        throw new Error(queryError);
    }


    connection.close();
    return result;
}


module.exports = {
    verify: verify
};