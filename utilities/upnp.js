/* ---------------------------------------------+
 * FILE NAME - upnp.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : activate upnp functionality    +
 * ---------------------------------------------*/

'use strict'

require('timers');
var natUpnp = require('./node-nat-upnp/lib/nat-upnp.js');
var client = natUpnp.createClient();


// keep request the router to make sure the mapping is alive
function portMapping (ttl) {
    var config = {
        public: 12345,
        private: 3000,
        ttl: ttl
    };

    setTimeout(client.portMapping(config , function (err) {
        // Will be called once finished
        if (err) {
            console.log(err);
            console.log('[Warning: UPnP port mapping failed]\n');
        } else {
            console.log('Request for port mapping valids for ' + ttl + ' seconds');
        }
    }), (ttl-1) * 1000);
}

portMapping(86400);