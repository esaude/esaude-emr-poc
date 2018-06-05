const Page = require('./page')

class ClinicDashboardPage extends Page {

	constructor() {
		super({
			isLoaded: {
				element: '[ng-app="clinic"]',
				urlPart: '/clinic/#/dashboard',
			},
		})
	}
}

module.exports = new ClinicDashboardPage()
