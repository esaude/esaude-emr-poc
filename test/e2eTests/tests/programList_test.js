
Feature('Program List');

let patient1
let tavrCuidadoProgram

// Create data before each test
// This data is automatically cleaned up in hooks.js
Before(async (I, Apis, Data) => {
	patient1 = await Apis.patient.create(Data.users.patient1)
	
	tavrCuidadoProgram = await Apis.programEnrollment.create({
		patient: patient1.uuid,
		program: Data.programs.SERVICO_TARV_CUIDADO,
		dateEnrolled: (new Date()).toISOString(),
	})
})

Scenario('Create person', async (I, Apis, Data) => {
	const dashboardPage = I.login()
	const registrationPage = dashboardPage.navigateToRegistrationPage()
	registrationPage.search(Data.users.patient1.identifiers[0].identifier)
	pause()
});
