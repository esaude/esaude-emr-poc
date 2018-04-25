
Feature('Login');

Scenario('Login successful with admin credentials', (I, LoginPage, Data) => {
	const loginStatus = LoginPage.login(Data.users.admin)
	loginStatus.successful()
});

Scenario('Login failed with invalid username', (I, LoginPage, Data) => {
	const loginStatus = LoginPage.login(Data.users.invalidUsername)
	loginStatus.unsuccessful()
});

Scenario('Login failed with invalid password', (I, LoginPage, Data) => {
	const loginStatus = LoginPage.login(Data.users.invalidPassword)
	loginStatus.unsuccessful()
});
