const event = require('codeceptjs').event;
const Apis = require('./rest/openMrsApis');

module.exports = function() {
	// Fired after every test
  event.dispatcher.on(event.test.after, async (test) => {
  	try{
  		// Remove any and all data that was injected into the DB
	  	// after each test
	  	await Apis.cleanUp();
  	} catch (err) {
        // eslint-disable-next-line angular/log
  		console.log(`The following error was thrown while cleaning up injected data: ${err}`);
  	}
  });
};
