let express = require('express');
let router = express.Router();
// authentication module
let auth = require('../utilities/auth.js');

// user login authentication
router.get('/', (req, res) => {
    let data = req.body;
    let resData = {
        result: 0, // 1: success, 0:fail
        description: '系統錯誤，請再試一次'
    };

    auth.login(data.email, data.pwd) // verify email and password then return result
        .then(result => {
            console.log(result);
            if (result.status) {
                resData = {
                    result: 1,
                    message: '認證成功',
                    fName: result.fName
                };

                // send json response
                res.status(201).json(resData);
            } else {
                resData = {
                    result: 0,
                    message: '帳號或密碼錯誤'
                };

                // send json response
                res.status(401).json(resData);
            }
        }, reason => {
            // send json response when error
            res.status(500).json(resData);
            console.log(reason);
        });
});


// export this router to use in our main.js
module.exports = router;