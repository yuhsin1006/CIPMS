let express = require('express');
let router = express.Router();

// get device information
router.post('/getDeviceInfo', (req, res) => {
    let resData = {
        result: 0,
        serial: '',
        macAddr: '',
        ipAddr: '',
        port: 1025,
        message: '系統錯誤，請再試一次'
    };

    let data = req.body;
    let queryTarget = {
        serial: data.serial
    };
    db.findDocument('cimpsDB', 'devices', queryTarget)
        .then(result => {
            let resData = {
                result: 1,
                serial: result.serial,
                macAddr: result.mac,
                ipAddr: result.ip,
                port: result.port,
                message: '成功'
            };

            // send json response
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resData));

            console.log('Success');
        }, reason => {
            let resData = {
                result: 0,
                serial: null,
                macAddr: null,
                ipAddr: null,
                port: null,
                message: ''
            };

            // send json response
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resData));

            console.log(reason);
        });
});


//export this router to use in our main.js
module.exports = router;