const assert = require('assert');
const querystring = require('querystring'); 

const APIMANAGER_LOGTAG = '[ApiManager]';
const API_LOGTAG = '[Api]';

// ApiManager holds on to each Api. An instance of Api manager can be passed
// into a test if that test needs to manipulate data on the server
// A detaled description of each Api can be foudn at the following urls:
//    https://wiki.openmrs.org/display/docs/REST+Web+Service+Resources+in+OpenMRS+1.8#RESTWebServiceResourcesinOpenMRS1.8-User
//    https://psbrandt.io/openmrs-contrib-apidocs/
class ApiManager {
  _init() {
    this.I = actor();

    // An array of information about resources that
    // we need to clean up when a test ends.
    //
    // Data format:
    // {
    //   api: ...,
    //   resource: ...,
    // }
    this.resourcesToCleanUp = [];

    // Create the APIs
    this._createApis();
  }

  // Remove all objects that were created during testing
  async cleanUp() {
    this.I.say(`${APIMANAGER_LOGTAG} Cleaning up ${this.resourcesToCleanUp.length} resources`);

    // Fix for #618: https://github.com/esaude/esaude-emr-poc/issues/618
    // Delete objects in the reverse order they were created
    while(this.resourcesToCleanUp.length > 0) {
      // Get info about the most recently created resource
      const index = this.resourcesToCleanUp.length - 1;
      const resourceData = this.resourcesToCleanUp[index];

      // Delete the created resource
      // Calling this will indirectly call _onApiDeletedResource
      // which will remove this resource from our collection
      // of resources to clean
      const api = resourceData.api;
      const resource = resourceData.resource;
      await api.delete(resource);
    }

    assert.equal(this.resourcesToCleanUp.length, 0,
      `${APIMANAGER_LOGTAG} Failed to clean up ${this.resourcesToCleanUp.length} resources after test`);
  }

  // Create the apis
  _createApis() {
    this.I.say(`${APIMANAGER_LOGTAG} Creating APIs`);

    // Creates and returns an instance of Api with the specified name and callbacks
    const createApi = apiName => new Api(apiName, this._onApiCreatedResource.bind(this), this._onApiDeletedResource.bind(this));

    //--------------
    // List APIs here
    //--------------
    this.encounter = createApi('encounter');
    this.patient = createApi('patient');
    this.person = createApi('person');
    this.programEnrollment = createApi('programenrollment');
    this.program = createApi('program');
    this.provider = createApi('provider');
    this.user = createApi('user');
    this.visit = createApi('visit');
  }

  // Callback executed each time an API creates a new resource
  _onApiCreatedResource(api, createdResource) {
    this.I.say(`${APIMANAGER_LOGTAG} Saving resource created by ${api.url}`);

    this.resourcesToCleanUp .push({
      api,
      resource: createdResource,
    });
  }

  // Callback executed each time an API deletes a new resource
  _onApiDeletedResource(api, deletedResource) {
    this.I.say(`${APIMANAGER_LOGTAG} Resource delete by ${api.url}, removing from our clean up collection`);

    // When a resource is deleted remove it from our list of created objects
    this.resourcesToCleanUp = this.resourcesToCleanUp.filter(data => data.api != api || data.resource.uuid != deletedResource.uuid);
  }
}

// This class contains methods that are used to send requests to
// a specific Api. Each Api is contained in the ApiManager class.
/* eslint-disable angular/json-functions */
class Api {
  constructor(apiName, onCreate, onDelete) {
    this.name = apiName;
    this.url = `/${apiName}`;
    this.I = actor();

    this.onCreate = onCreate;
    this.onDelete = onDelete;
  }

  async getAll(options) {
    const query = querystring.stringify(options);
    const response = await this.I.sendGetRequest(`${this.url}?${query}`);

    assert.equal(response.statusCode, 200,
      `${API_LOGTAG} get all ${this.url} request failed ${JSON.stringify(response, null, 2)}`);

    this.I.say(`${API_LOGTAG} ${this.url} get all successful ${JSON.stringify(response.body, null, 2)}`);

    return response.body.results;
  }

  async get(id) {
    const response = await this.I.sendGetRequest(`${this.url}/${id}`);

    assert.equal(response.statusCode, 200,
      `${API_LOGTAG} get ${this.url} by id request failed ${JSON.stringify(response, null, 2)}`);

    this.validate(response.body);

    this.I.say(`${API_LOGTAG} ${this.url} get by id successful ${JSON.stringify(response.body, null, 2)}`);

    return response.body;
  }

  async create(json) {
    const response = await this.I.sendPostRequest(this.url, JSON.stringify(json));
    
    assert.equal(response.statusCode, 201,
      `${API_LOGTAG} create ${this.url} request failed ${JSON.stringify(response, null, 2)}`);

    this.validate(response.body);

    this.I.say(`${API_LOGTAG} ${this.url} create successful ${JSON.stringify(response.body, null, 2)}`);

    // When a new resource is created save it so we can delete it
    // before the test is over
    if(response.statusCode == 201)
      this.onCreate(this, response.body);

    return response.body;
  }

  async delete(json) {
    const response = await this.I.sendDeleteRequest(`${this.url}/${json.uuid}?purge`);

    assert.equal(response.statusCode, 204,
      `${API_LOGTAG} delete ${this.url} request failed ${JSON.stringify(response, null, 2)}`);

    // Let the listener know we deleted a resource
    if(response.statusCode == 204)
      this.onDelete(this, json);

    this.I.say(`${API_LOGTAG} ${this.url} delete successful`);
  }

  validate(body) {
    assert.ok(body, `${API_LOGTAG} ${this.url} object invalid`);
    assert.ok(body.uuid, `${API_LOGTAG} ${this.url} invalid`);
  }
}

// The chunk of code makes sure we ever only create one instance of ApiManager
// We always want the same instance so it's easy to clean up after each test run.
// Each Api stores the data is creates so it knows what to delete when api.cleanUp is called.
// If a new instanc of ApiManager was created we would lose our reference to the old ApiManager
// and any data that it's Apis created.
const APIMANAGER_KEY = Symbol.for("esaude.e2e.ApiManager");
var globalSymbols = Object.getOwnPropertySymbols(global);
var hasApiManager = (globalSymbols.indexOf(APIMANAGER_KEY) > -1);
if(!hasApiManager) {
  global[APIMANAGER_KEY] = new ApiManager();
}

module.exports = global[APIMANAGER_KEY];
