// Test for:
// https://docs.google.com/document/d/1hihKCjCQVprju_SCi1nqXCYchY-ThX4iqHPkv4asnt0/edit#heading=h.gpe6dgjlwx02

Feature('Patient Search');

Before(async (I, Apis, Data) => {
	// Create the patients
	I.say("Creating patient one");
	await Apis.patient.create(Data.patients.patient1);

	I.say("Creating patient two");
	await Apis.patient.create(Data.patients.patient2);

	// Login
  I.login();
});

Scenario('Validate searching works on the clinic page', (I, Data, DashboardPage) => {
	const clinicPage = DashboardPage.navigateToClinicPage();
	validateSearch(I, Data, clinicPage);
});

Scenario('Validate searching works on the lab page', (I, Data, DashboardPage) => {
	const labPage = DashboardPage.navigateToLabPage();
	validateSearch(I, Data, labPage);
});

Scenario('Validate searching works on the pharmacy page', (I, Data, DashboardPage) => {
	const pharmacyPage = DashboardPage.navigateToPharmacyPage();
	validateSearch(I, Data, pharmacyPage);
});

Scenario('Validate searching works on the registration page', (I, Data, DashboardPage) => {
	const registrationPage = DashboardPage.navigateToRegistrationPage();
	validateSearch(I, Data, registrationPage);
});

/*
Scenario('Validate searching works on the social page', (I, Data, DashboardPage) => {
	const socialPage = DashboardPage.navigateToSocialPage()
	validateSearch(I, Data, socialPage)
})
*/

Scenario('Validate searching works on the vitals page', (I, Data, DashboardPage) => {
	const vitalsPage = DashboardPage.navigateToVitalsPage();
	validateSearch(I, Data, vitalsPage);
});

// Runs the core search scenario on the given page
const validateSearch = (I, Data, pageWithSearch) => {
	const nonExistentPatientName = "No_Patient_Has_This_Name";

	I.say('Disabling auto select');
	pageWithSearch.disableAutoSelect();

	I.say('Search for the first few letters of the patient\'s first name');
	pageWithSearch.search(Data.patients.patient1.person.names[0].givenName.substring(0, 3));

	I.say('Validate patient 1\'s data is visible');
	pageWithSearch.seePatientRecord(Data.patients.patient1);

	I.say('Validate patient 2\'s data is visible since patient 2\'s first name start with the same letter as patient 1\'s');
	pageWithSearch.seePatientRecord(Data.patients.patient2);

	I.say('Search for the patient\'s entire first name');
	pageWithSearch.search(Data.patients.patient1.person.names[0].givenName);

	I.say('Validate patient 1\'s data is still visible');
	pageWithSearch.seePatientRecord(Data.patients.patient1);

	I.say('Search for the patient\'s identifier');
	pageWithSearch.search(Data.patients.patient1.identifiers[0].identifier);

	I.say('Validate patient 1\'s data is still visible');
	pageWithSearch.seePatientRecord(Data.patients.patient1);

	I.say('Search for a name that no patient has');
	pageWithSearch.search(nonExistentPatientName);

	I.say('Make sure no results are shown');
	pageWithSearch.seeNoResults();
};
