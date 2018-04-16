
Feature('Login');

Scenario('Login successful with admin credentials', (I, Data) => {
	const loginStatus = I.login(Data.users.admin)
	loginStatus.successful()
});

Scenario('Login failed with invalid username', (I, Data) => {
	const loginStatus = I.login(Data.users.invalidUsername)
	loginStatus.unsuccessful()
});

Scenario('Login failed with invalid password', (I, Data) => {
	const loginStatus = I.login(Data.users.invalidPassword)
	loginStatus.unsuccessful()
});
