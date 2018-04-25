const assert = require('assert')

let I;

module.exports = {

  _init() {
    I = actor();
  },

  async get(id) {
    const response = await I.sendGetRequest(`/user/${id}`)

    assert.equal(response.statusCode, 200,
      `get user response failed ${JSON.stringify(response, null, 2)}`)

    const user = response.body
    this.validate(user)
    return user
  },

  async create(userData) {
    const response = await I.sendPostRequest('/user', JSON.stringify(userData))
    
    assert.equal(response.statusCode, 201,
      `create user response failed ${JSON.stringify(response, null, 2)}`)

    const createdUser = response.body
    this.validate(createdUser)

    I.say(`User ${createdUser.person.display} created successfully`)
    return createdUser
  },

  async delete(userData) {
    const response = await I.sendDeleteRequest(`/user/${userData.uuid}?purge`)

    assert.equal(response.statusCode, 204)
  },

  validate(user) {
    assert.ok(user, 'User object invalid')
    assert.ok(user.uuid, 'User invalid')
  }
}