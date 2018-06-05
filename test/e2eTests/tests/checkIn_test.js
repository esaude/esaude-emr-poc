// Test for:
// https://docs.google.com/document/d/1hihKCjCQVprju_SCi1nqXCYchY-ThX4iqHPkv4asnt0/edit#heading=h.gpe6dgjlwx02

Feature('Check In Patient');

Before(async (I, Apis, Data) => {
	// Create the patient
	I.say("Creating patient one")
	const patient = await Apis.patient.create(Data.users.patient1)
})

Scenario('', (I, Data, RegistrationDashboardPage) => {
	I.say('login')
  const dashboardPage = I.login()

  I.say('Navigate to the registration page')
  const registrationPage = dashboardPage.navigateToRegistrationPage()

  I.say('Search for patient 1\'s identifier')
	registrationPage.search(Data.users.patient1.identifiers[0].identifier)

	I.say('Validate patient 1\'s data is visible')
	registrationPage.seePatientRecord(Data.users.patient1)

	I.say('Select patient 1')
	registrationPage.clickSearchResult(Data.users.patient1)

	I.say('Make sure the registration dashboard page is loaded')
	RegistrationDashboardPage.isLoaded()

	I.say('Click on the check in button')
	RegistrationDashboardPage.clickCheckIn()

	I.say('Waiting for the check in to complete')
	I.waitForInvisible('#overlay', 5)

	I.say('Validate the check in message appears')
	I.see('Deu entrada hoje em', 'check-in')
})
