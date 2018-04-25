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
			username: 'p1',
			password: 'Patient1',
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
			username: 'p2',
			password: 'Patient2',
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