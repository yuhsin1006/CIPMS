/* ---------------------------------------------+
 * FILE NAME - database.js                      +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : collection of functions that do+
 *               operation to the database.     +
 * ---------------------------------------------*/

'use strict'
exports.version = '2.0.0';


// import mongoDB libaraies
let MongoClient = require('mongodb').MongoClient;


// insert a document to database
async function insertDocument(dbName, collectionName, data) {
    // check input data
    if (!data) {
        throw new Error('No data');
    }
    if (!collectionName || typeof collectionName != 'string') {
        throw new Error('Bad collection name');
    }

    // establish connection
    let connection;
    try {
        connection = await MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
    } catch (connectionError) {
        // handle error when connection failed
        throw new Error('Database connection error');
    }

    // select collection and insert data
    let collection = connection.collection(collectionName);
    try {
        await collection.insertOne(data);
    } catch (insertError) {
        throw new Error('Failed to insert');
    }


    connection.close();
    return;
}


async function findDocument(dbName, collectionName, data) {
    // check input data
    if (!data) {
        throw new Error('No condition to be referenced.');
    }
    if (!collcetionName || typeof collectionName != 'string') {
        throw new Error('Bad collection name');
    }


    // establish connection
    let connection;
    try {
        connection = await MongoClient.connect(`mongodb://localhost:27017/${dbName}`);
    } catch (connectionError) {
        // handle error when connection failed
        throw new Error('Database connection error');
    }

    // select collection and insert data
    let collection = connection.collection(collectionName);
    let result;
    try {
        await collection.findOne(data)
            .then(value => {
                result = value;
            }, reason => {
                throw new Error(reason);
            });
    } catch (insertError) {
        throw new Error('Failed to insert');
    }


    connection.close();
    return result;
}


module.exports = {
    insertDocument: insertDocument,
    findDocument: findDocument
};