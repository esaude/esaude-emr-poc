const event = require('codeceptjs').event;
const Apis = require('./rest/openMrsApis');

/**
 * Attaches handlers to Codeceptjs events.
 * All high level event handlers should be attached in this file.
 * Right now this function listens for when a test has completed
 * and cleans up any data that was injected into the database
 * during the test.
 */
module.exports = function() {
  /** After each test clean up data that was injected into the database */
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
