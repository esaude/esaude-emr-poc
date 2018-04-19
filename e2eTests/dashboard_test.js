
Feature('Dashboard');

Before((I) => { // or Background
  const loginStatus = I.login()
	loginStatus.successful()
});

Scenario('Logout successfully', (I, DashboardPage) => {
	const logoutStatus = DashboardPage.logout()
	logoutStatus.successful()
});
