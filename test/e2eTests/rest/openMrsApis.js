const assert = require('assert')

class Api {
  constructor(resourceType) {
  	this.type = resourceType
  	this.url = `/${resourceType}`
    this.I = actor()

    this.resourcesToDestroy = []
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

    // When a new resource is created save it so we can delete it
    // before the test is over
    if(response.statusCode == 201)
      this.resourcesToDestroy.push(response.body)

    return response.body
  }

  async delete(json) {
    const response = await this.I.sendDeleteRequest(`${this.url}/${json.uuid}?purge`)

    assert.equal(response.statusCode, 204)

    // When the resource is deleted successfully remove it from
    // our list of things to destroy later
    if(response.statusCode == 204)
      this.resourcesToDestroy = this.resourcesToDestroy.filter(r => r.uuid != json.uuid)
  }

  async cleanUp() {
    // Delete all resources that were created
    for(var toDestroyIndex = 0; toDestroyIndex < this.resourcesToDestroy.length; toDestroyIndex++) {
      await this.delete(this.resourcesToDestroy[toDestroyIndex])
    }
  }

  validate(body) {
    assert.ok(body, `${this.type} object invalid`)
    assert.ok(body.uuid, `${this.type} invalid`)
  }
}

// Detaled description of each API found at:
// https://wiki.openmrs.org/display/docs/REST+Web+Service+Resources+in+OpenMRS+1.8#RESTWebServiceResourcesinOpenMRS1.8-User
// Best resource: https://psbrandt.io/openmrs-contrib-apidocs/
class ApiManager {
  _init() {
    //--------------
    // List APIs here
    //--------------
    this.patient = new Api('patient')
    this.person = new Api('person')
    this.programEnrollment = new Api('programenrollment')
    this.provider = new Api('provider')
    this.user = new Api('user')
  }

  cleanUp() {
    // Clean up each API
    for(const propertyName in this) {
      const property = this[propertyName]
      
      if(property instanceof Api)
        property.cleanUp()
    }
  }
}

// Get/Create a singleton of ApiManager
const APIMANAGER_KEY = Symbol.for("esaude.e2e.ApiManager")
var globalSymbols = Object.getOwnPropertySymbols(global)
var hasApiManager = (globalSymbols.indexOf(APIMANAGER_KEY) > -1)
if(!hasApiManager) {
  global[APIMANAGER_KEY] = new ApiManager()
}

module.exports = global[APIMANAGER_KEY]
