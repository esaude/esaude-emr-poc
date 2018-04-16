
Feature('Login');

Scenario('Login as admin successful', (I, Data) => {
	const loginStatus = I.login(Data.users.admin)
	loginStatus.successful()
});

Scenario('Login with invalid username', (I, Data,) => {
	const loginStatus = I.login(Data.users.invalidUsername)
	loginStatus.unsuccessful()
});

Scenario('Login with invalid password', (I, Data) => {
	const loginStatus = I.login(Data.users.invalidPassword)
	loginStatus.unsuccessful()
});
