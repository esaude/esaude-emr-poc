const assert = require('assert')

class Api {
  constructor(resourceType) {
  	this.type = resourceType
  	this.url = `/${resourceType}`
    this.I = actor()
  }

  async get(id) {
    const response = await this.I.sendGetRequest(`${this.url}/${id}`)

    assert.equal(response.statusCode, 200,
      `get ${this.type} response failed ${JSON.stringify(response, null, 2)}`)

    this.validate(response.body)
    return response.body
  }

  async create(json) {
    const response = await this.I.sendPostRequest(this.url, JSON.stringify(json))
    
    assert.equal(response.statusCode, 201,
      `create ${this.type} response failed ${JSON.stringify(response, null, 2)}`)

    this.validate(response.body)

    this.I.say(`${this.type} created successfully`)
    return response.body
  }

  async delete(json) {
    const response = await this.I.sendDeleteRequest(`${this.url}/${json.uuid}?purge`)

    assert.equal(response.statusCode, 204)
  }

  validate(body) {
    assert.ok(body, `${this.type} object invalid`)
    assert.ok(body.uuid, `${this.type} invalid`)
  }
}

// Detaled description of each API found at:
// https://wiki.openmrs.org/display/docs/REST+Web+Service+Resources+in+OpenMRS+1.8#RESTWebServiceResourcesinOpenMRS1.8-User
// Best resource: https://psbrandt.io/openmrs-contrib-apidocs/
module.exports = {

  _init() {
    this.patient = new Api('patient')
    this.person = new Api('person')
    this.user = new Api('user')
  },
}