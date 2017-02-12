let express = require('express');
let router = express.Router();

// route that devices will automatically connect and reqister their current ip:port
router.use('/', (req, res) => {
    let resData = {
        result: 0,
        message: 'Under construction.'
    };
    // send json response
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resData));
});


//export this router to use in our main.js
module.exports = router;