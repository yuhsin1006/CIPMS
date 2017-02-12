let express = require('express');
let router = express.Router();

// user login authentication
router.post('/', (req, res) => {
    let data = req.body;
    let resData = {
        result: 0, // 1: success, 0:fail
        description: '系統錯誤，請再試一次'
    };
    auth.verify(data.email, data.pwd) // verify email and password then return result
        .then(result => {
            console.log(result);
            if (result.status) {
                resData = {
                    result: 1,
                    message: '認證成功',
                    fName: result.fName
                };

                // send json response
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(resData));
            } else {
                resData = {
                    result: 0,
                    message: '帳號或密碼錯誤'
                };

                // send json response
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(resData));
            }
        }, reason => {
            // send json response
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resData));
            console.log(reason);
        });
});


//export this router to use in our main.js
module.exports = router;