const Page = require('./page')

class RegistrationDashboardPage extends Page {

	constructor() {
		super({
			isLoaded: {
				element: '[ui-sref="dashboard.program"]',
				urlPart: '/registration/#/dashboard',
			},
		})
	}

	clickCheckIn() {
		this.I.wait(1)

		this.I.waitForElement({css: '.checkin button'}, 5)
		this.I.click({css: '.checkin button'})

		this.I.say('Waiting for the check in to complete')
		this.I.waitForInvisible('#overlay', 5)

		this.I.wait(1)
	}
}

module.exports = new RegistrationDashboardPage()
