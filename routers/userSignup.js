let express = require('express');
let router = express.Router();
let db = require('../utilities/database.js');


// handle sign up process from user
router.post('/', (req, res) => {
    // request body
    // {
    //      fName:  <string>    First Name
    //      lName:  <string>    Last Name
    //      phone:  <string>    telephone number
    //      email:  <string>    email address (used as account)
    //      pwd:    <string>    password
    // }
    let data = req.body;

    /* send json response */
    // response data schema
    // {
    //      result:   <integer>  1: success, 0:fail
    //      message:  <string>   message to user, shown by client app
    // }
    let resData = {
        result: 0,
        message: '系統錯誤，請再試一次'
    };
    db.insertDocument('cimpsDB', 'users', data) // insert document
        .then(() => {
            resData = {
                result: 1,
                message: '註冊成功!'
            };

            // send response
            res.status(201).json(JSON.stringify(resData));
            console.log('A user registered successfully\n');
        }, err => {
            resData = {
                result: 0,
                message: '註冊失敗，請再試一次。'
            };

            res.status(500).json(JSON.stringify(resData));
            console.log(err);
        });
});


//export this router to use in our main.js
module.exports = router;