// Test for:
// https://docs.google.com/document/d/123Dmfh0gn8gZdiZmN91PKTf8-4K06ZEdtT-Xg4_pz2c/edit#

Feature('Register Patient');


Before((I) => {
  I.login()
});

Scenario('Attemp to avoid tab sequence', (I, Translator, DashboardPage) => {
	
	const registrationPage = DashboardPage.navigateToRegistrationPage()
	registrationPage.initRegistration()

	const tabSequenseMessage = Translator.localize('FOLLOW_SEQUENCE_OF_TABS')

	I.click(registrationPage.tabs.name)
    I.see(Translator.localize('FIELD_IS_REQUIRED'))
    
    const tabs = registrationPage.tabs

	for (var key in tabs){
		if(key != 'identifiers' && key != 'name' ){
			I.click(tabs[key])
			I.see(tabSequenseMessage)
		}
    }

})

Scenario('Attemp to register patient with invalid identifiers', (I, Translator, DashboardPage) => {
	
	const registrationPage = DashboardPage.navigateToRegistrationPage()		
	registrationPage.initRegistration()

	const invalidFormat = Translator.localize('INVALID_FORMAT')

	// with empty identifier
	I.click(registrationPage.buttons.nextStep)
	I.see(Translator.localize('FIELD_IS_REQUIRED'))

	var invalidIdentifiers = ["QWERTY", "PPDDUUSS/AA/NNNNN", "11223344/AA/12345"]

	for(var i = 0; i < invalidIdentifiers.length; i++) { 
	   	I.fillField(registrationPage.fields.nid, '')
		I.fillField(registrationPage.fields.nid, invalidIdentifiers[i])
		I.click(registrationPage.buttons.nextStep)
		I.see(invalidFormat)
	}
})