
Feature('Login');

Scenario('Login successful with admin credentials and logout', (I, LoginPage, Data) => {
	// Log the user in
	const loginStatus = LoginPage.login(Data.users.admin);
	
	// Validate that login was successful
	const dashboardPage = loginStatus.successful();
	
	// Log the user out
	const logoutStatus = dashboardPage.logout();
	
	// Validate that logout was successful
	logoutStatus.successful();
});

Scenario('Attempt to login with a user that does not have the provider role', async (I, Apis, LoginPage, Data) => {
	// Create a user that does not have the provider role
	await Apis.user.create(Data.users.nonProvider);

	// Attempt to log the user in
	const loginStatus = LoginPage.login(Data.users.nonProvider);

	// TODO: Make strings dependant on locale
	loginStatus.unsuccessful("Não estás configurado como provedor. Por favor, contacte o administrador.");
});

Scenario('Login failed with invalid username', (I, LoginPage, Data) => {
	const loginStatus = LoginPage.login(Data.users.invalidUsername);
	loginStatus.unsuccessful("A autenticação falhou. Por favor, tente novamente");
});

Scenario('Login failed with invalid password', (I, LoginPage, Data) => {
	const loginStatus = LoginPage.login(Data.users.invalidPassword);
	loginStatus.unsuccessful("A autenticação falhou. Por favor, tente novamente");
});

/*Scenario('Login failed with invalid default locale', async (I, Apis, LoginPage, Data) => {
	// Create a user with an invalid default locale
	const invalidLocationUser = await Apis.user.create(Data.users.invalidDefaultLocation)

	await Apis.provider.create(Data.providers.generateJsonFromUser(invalidLocationUser))

	const loginStatus = LoginPage.login(Data.users.invalidDefaultLocation)
	loginStatus.unsuccessful("A localização pre-definida não foi configurada. Por favor, contacte o administrador do sistema.")
})*/
