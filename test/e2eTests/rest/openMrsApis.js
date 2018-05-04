const assert = require('assert')

// ApiManager holds on to each Api. An instance of Api manager can be passed
// into a test if that test needs to manipulate data on the server
// A detaled description of each Api can be foudn at the following urls:
//    https://wiki.openmrs.org/display/docs/REST+Web+Service+Resources+in+OpenMRS+1.8#RESTWebServiceResourcesinOpenMRS1.8-User
//    https://psbrandt.io/openmrs-contrib-apidocs/
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

// This class contains methods that are used to send requests to
// a specific Api. Each Api is contained in the ApiManager class.
class Api {
  constructor(apiName) {
  	this.name = apiName
  	this.url = `/${apiName}`
    this.I = actor()

    this.resourcesToDestroy = []
  }

  async get(id) {
    const response = await this.I.sendGetRequest(`${this.url}/${id}`)

    assert.equal(response.statusCode, 200,
      `get ${this.name} request failed ${JSON.stringify(response, null, 2)}`)

    this.validate(response.body)
    return response.body
  }

  async create(json) {
    const response = await this.I.sendPostRequest(this.url, JSON.stringify(json))
    
    assert.equal(response.statusCode, 201,
      `create ${this.name} request failed ${JSON.stringify(response, null, 2)}`)

    this.validate(response.body)

    this.I.say(`${this.name} created successfully`)

    // When a new resource is created save it so we can delete it
    // before the test is over
    if(response.statusCode == 201)
      this.resourcesToDestroy.push(response.body)

    return response.body
  }

  async delete(json) {
    const response = await this.I.sendDeleteRequest(`${this.url}/${json.uuid}?purge`)

    assert.equal(response.statusCode, 204,
      `delete ${this.name} request failed ${JSON.stringify(response, null, 2)}`)

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
    assert.ok(body, `${this.name} object invalid`)
    assert.ok(body.uuid, `${this.name} invalid`)
  }
}

// The chunk of code makes sure we ever only create one instance of ApiManager
// We always want the same instance so it's easy to clean up after each test run.
// Each Api stores the data is creates so it knows what to delete when api.cleanUp is called.
// If a new instanc of ApiManager was created we would lose our reference to the old ApiManager
// and any data that it's Apis created.
const APIMANAGER_KEY = Symbol.for("esaude.e2e.ApiManager")
var globalSymbols = Object.getOwnPropertySymbols(global)
var hasApiManager = (globalSymbols.indexOf(APIMANAGER_KEY) > -1)
if(!hasApiManager) {
  global[APIMANAGER_KEY] = new ApiManager()
}

module.exports = global[APIMANAGER_KEY]
