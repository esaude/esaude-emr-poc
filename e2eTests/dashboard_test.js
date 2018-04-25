
Feature('Dashboard');

Before((I) => { // or Background
  I.login()
});

Scenario('Logout successfully', (I, DashboardPage) => {
	const logoutStatus = DashboardPage.logout()
	logoutStatus.successful()
});
