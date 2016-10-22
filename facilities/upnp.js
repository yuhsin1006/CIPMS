/* ---------------------------------------------+
 * FILE NAME - upnp.js                          +
 * ---------------------------------------------+
 * Creator : Archibald Chiang                   +
 * ---------------------------------------------+
 * Description : activate upnp functionality    +
 * ---------------------------------------------*/

require('timers');
var natUpnp = require('../node_modules/node-nat-upnp/lib/nat-upnp.js');
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
            console.err('Error occurred');
        } else {
            console.log('Request for port mapping valids for ' + ttl + ' seconds');
        }
    }), ttl-1);
}