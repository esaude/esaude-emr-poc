// Generates a patient identifier
const generatePatientIdentifier = () => {
	// Generates a random number between [0,9]
	const g = () => Math.floor(Math.random() * Math.floor(9))

	// Returns a randomly generated identifier of the format
	// "PPDDUUSS/AA/NNNNN" where each is a number between [0, 9]
	return `${g()}${g()}${g()}${g()}${g()}${g()}${g()}${g()}/${g()}${g()}/${g()}${g()}${g()}${g()}${g()}`
}

// Defines the uuids of roles
const Roles = {
	provider: '8d94f280-c2cc-11de-8d13-0010c6dffd0f',
}

// Data useful for tests
module.exports = {
	// Data about each user
	users: {

		// The admin user
		admin: {
			username: 'admin',
			password: 'eSaude123',
			person: {
				names: [
					{
						givenName: "AdminFirstName",
						familyName: "AdminLastName"
					}
				],
				gender: 'F',
			},
		},

		// A user with a username that is not expected to be in the database
		invalidUsername: {
			username: 'invalidUsername',
			password: 'eSaude123',
		},

		// The admin user with an invalid password
		invalidPassword: {
			username: 'admin',
			password: 'thisIsInvalid',
		},

		// A user that is not a provider
		nonProvider: {
			username: 'nonProvider',
			password: 'testPass',
			person: {
				names: [
					{
						givenName: "NonProviderFirstName",
						familyName: "NonProviderLastName"
					}
				],
				gender: 'M',
			},
			/*roles: [
				Roles.provider,
			],*/
		},

		patient1: {
			"identifiers": [
				{
					"identifier": generatePatientIdentifier(),
					"identifierType": "e2b966d0-1d5f-11e0-b929-000c29ad1d07", // NID (SERVICO TARV)
					"location": "4c34a53f-b0c2-4315-9829-1a07f76e10a8", // Zumba
					"preferred": true
				}
			],
			person: {
				names: [
					{
						givenName: "Patient1FirstName",
						familyName: "Patient1LastName"
					}
				],
				gender: 'M',
			},
		},

		patient2: {
			"identifiers": [
				{
					"identifier": generatePatientIdentifier(),
					"identifierType": "e2b966d0-1d5f-11e0-b929-000c29ad1d07", // NID (SERVICO TARV)
					"location": "4c34a53f-b0c2-4315-9829-1a07f76e10a8", // Zumba
					"preferred": true
				}
			],
			person: {
				names: [
					{
						givenName: "Patient2FirstName",
						familyName: "Patient2LastName"
					}
				],
				gender: 'F',
			},
		},
	},

	// Utilities for generating provider related data
	providers: {
		// Generates JSON that can be used to make
		// the user a provider
		generateJsonFromUser: function (user) {
			return {
				person: user.person.uuid,
				identifier: user.systemId
			}
		},
	},

	// Uuids for programs
	programs: {
		SERVICO_TARV_CUIDADO: '7b2e4a0a-d4eb-4df7-be30-78ca4b28ca99',
		SERVICO_TARV_TRATAMENTO: 'efe2481f-9e75-4515-8d5a-86bfde2b5ad3',
		TUBERCULOSE: '142d23c4-c29f-4799-8047-eb3af911fd21',
		CCR: '611f0a6b-68b7-4de7-bc7a-fd021330eef8',
		CCU: '8954a750-079e-4bf2-940c-b4f71ea8bb15',
		PTV_ETV: '06057245-ca21-43ab-a02f-e861d7e54593',
		CLINICA_MOVEL: 'fb455824-fb53-45ab-bf5a-a81482ff6848',
	}
}