Feature('Registration');

// Patients get created before each best
let Patient1 = null

Before(async (I, Apis, Data) => {
	Patient1 = await Apis.patient.create(Data.users.patient1)

  const dashboardPage = I.login()
  dashboardPage.navigateToRegistrationPage()
})

// Test for:
// https://docs.google.com/document/d/1hihKCjCQVprju_SCi1nqXCYchY-ThX4iqHPkv4asnt0/edit#heading=h.gpe6dgjlwx02
Scenario('Test search', async (I, Apis, RegistrationPage, Data) => {
	const nonExistentPatientName = "No_Patient_Has_This_Name"

	I.say('Create patient two')
	const patient2 = await Apis.patient.create(Data.users.patient2)
	
	I.say('Search for the first few letters of the patient\'s first name')
	RegistrationPage.search(Data.users.patient1.person.names[0].givenName.substring(0, 3))

	I.say('Validate patient 1\'s data is visible')
	RegistrationPage.seePatientRecord(Data.users.patient1)

	I.say('Validate patient 2\'s data is visible since patient 2\'s first name start with the same letter as patient 1\'s')
	RegistrationPage.seePatientRecord(Data.users.patient2)

	I.say('Search for the patient\'s entire first name')
	RegistrationPage.search(Data.users.patient1.person.names[0].givenName)

	I.say('Validate patient 1\'s data is still visible')
	RegistrationPage.seePatientRecord(Data.users.patient1)

	I.say('Search for the patient\'s identifier')
	RegistrationPage.search(Data.users.patient1.identifiers[0].identifier)

	I.say('Validate patient 1\'s data is still visible')
	RegistrationPage.seePatientRecord(Data.users.patient1)

	I.say('Search for a name that no patient has')
	RegistrationPage.search(nonExistentPatientName)

	I.say('Make sure no results are shown')
	RegistrationPage.seeNoResults()
})
