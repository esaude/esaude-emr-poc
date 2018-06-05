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
		this.I.waitForElement({css: '.checkin button'}, 5)
		this.I.click({css: '.checkin button'})
	}
}

module.exports = new RegistrationDashboardPage()
