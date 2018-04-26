const generatePatientIdentifier = () => {
	// Generates a random number between [0,9]
	const g = () => Math.floor(Math.random() * Math.floor(9))

	return `${g()}${g()}${g()}${g()}${g()}${g()}${g()}${g()}/${g()}${g()}/${g()}${g()}${g()}${g()}${g()}`
}

// Data useful for tests
module.exports = {
	users: {
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

		invalidUsername: {
			username: 'invalidUsername',
			password: 'eSaude123',
		},

		invalidPassword: {
			username: 'admin',
			password: 'thisIsInvalid',
		},
	},
}