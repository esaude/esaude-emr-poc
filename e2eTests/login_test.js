
Feature('Login');

Scenario('Login as admin successful', (I, Data) => {
	I.login(Data.users.admin)
	I.waitForElement('#home-link', 5);
});

Scenario('Login with invalid username', (I, Data) => {
	I.login(Data.users.invalidUsername)
	I.waitForElement('div[ng-show="vm.errorMessageTranslateKey"]', 5)
});

Scenario('Login with invalid password', (I, Data) => {
	I.login(Data.users.invalidPassword)
	I.waitForElement('div[ng-show="vm.errorMessageTranslateKey"]', 5)
});
