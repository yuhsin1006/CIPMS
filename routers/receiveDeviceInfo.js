let express = require('express');
let router = express.Router();
let db = require('../utilities/database.js');

// route that devices will automatically connect and reqister their current ip:port
router.post('/', (req, res) => {
    // Device information object
    // {
    //    serial:   <string>  product serial number
    //    mac:      <string>  mac address of remote device
    //    ip:       <string>  ip address
    //    port:     <int>     port
    //    regTime:  <Date>    time that remote device registered
    //    belongTo: <string>  
    // }
    // record device information
    var deviceInfo = {
        serial: 1,
        mac: 1,
        ip: req.connection.remoteAddress,
        port: req.connection.remotePort,
        regTime: Date.now(),
        belongTo: null
    };
    console.log(deviceInfo); // log incoming information

    // insert into database and return result
    let resData;
    db.insertDocument('cimpsDB', 'devices', deviceInfo)
        .then(() => {
            resData = {
                result: 1,
                message: 'Device register successfully'
            };

            // send json response
            res.status(201).json(resData);
            console.log('Success\n\n');
        }, err => {
            resData = {
                result: 0,
                message: err
            };

            // send json response
            res.status(500).json(resData);
            console.log(err);
        });
});


//export this router to use in our main.js
module.exports = router;