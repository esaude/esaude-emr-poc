const event = require('codeceptjs').event;
const Apis = require('./rest/openMrsApis')

module.exports = function() {

  event.dispatcher.on(event.test.after, function (test) {
  	// Remove any and all data that was injected into the DB
  	// after each test
  	Apis.cleanUp()
  });
}