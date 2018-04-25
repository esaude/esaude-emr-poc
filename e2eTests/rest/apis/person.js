const assert = require('assert')

let I;

module.exports = {

  _init() {
    I = actor();
  },

  create: async (personData) => {
    const response = await I.sendPostRequest('/person', JSON.stringify(personData))
    
    assert.equal(response.statusCode, 201,
      `create person response failed ${JSON.stringify(response, null, 2)}`)

    const createdPerson = response.body
    this.validate(createdPerson)
    return createdPerson
  },

  validate: (person) => {
    assert.ok(person, 'Person object invalid')
    assert.ok(person.uuid, 'Person invalid')
  }
}