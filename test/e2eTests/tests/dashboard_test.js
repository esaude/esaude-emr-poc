
Feature('Dashboard');

// In order to be on the dashboard we must first login
Before((I) => {
  I.login()
});

Scenario('Logout successfully', (I, DashboardPage) => {
	const logoutStatus = DashboardPage.logout()
	logoutStatus.successful()
});
