/* ---------------------------------------------+
 * FILE NAME - main.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : index program for CIMPS.       +
 * ---------------------------------------------*/
'use strict';

// upnp port forwarding
//let upnp = require('./utilities/upnp.js');
// import mongoDB libaraies
let db = require('./utilities/database.js');
// express libaraies
let express = require('express');
let app = express();
let path = require('path');
// bodyParser
let bodyParser = require('body-parser');
// authentication module
let auth = require('./utilities/auth.js');
// routers
let userSignup = require('./routers/userSignup.js');
let authentication = require('./routers/authentication.js');
let deviceRegisteration = require('./routers/deviceRegisteration.js');
let getDeviceInfo = require('./routers/getDeviceInfo.js');
let receiveDeviceInfo = require('./routers/receiveDeviceInfo.js');


// set folder 'public' as public access folder
app.use(express.static('public'));
// use body-parser to parse body to json format
app.use(bodyParser.json());


/* routing definitions */
// to login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});
// handle sign up process from user
app.use('/userSignup', userSignup);
// user login authentication
app.use('/auth', authentication);
// route that devices will automatically connect and reqister their current ip:port
app.use('/deviceReg', deviceRegisteration);
// get device information
app.use('/getDeviceInfo', getDeviceInfo);
// get device information
app.use('/devices', receiveDeviceInfo);


app.use((err, req, res, next) => {
    console.log(err.stack);
    res.sendStatus(500);
});

app.listen(3000, () => {
    console.log('App listening on port 3000.\n');
});