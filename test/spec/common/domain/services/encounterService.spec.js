xdescribe('EncounterService', function () {
  //TODO: Discuss with valerios API design
  var $cookieStore;
  var encounterService;
  var $q= Q;
  var rootScope = {currentProvider: {uuid: 'provider-uuid'}};

  beforeEach(module('bahmni.common.domain'));

  beforeEach(module(function ($provide) {
    $cookieStore = jasmine.createSpyObj('$cookieStore', ['get']);
    $provide.value('$q', $q);
    $provide.value('$cookieStore', $cookieStore);
    $provide.value('$rootScope', rootScope);
  }));

  beforeEach(inject(['encounterService',function (encounterServiceInjected) {
    encounterService = encounterServiceInjected;
  }]));

  it('should get encounter type based on login location when login location uuid is present',function (done) {
    var programUuid = null;
    //var locationUuid = "locationUuid";
    var loginLocationToEncounterTypeMapping = {
      "data" :{
        "results": [
          {   "entityUuid": {"uuid": "locationUuid"},
            "mappings": [{"uuid": "encounterUuid"}]}
        ]}};

    encounterService.getDefaultEncounterType().then(function (response) {
      expect(response[0].uuid).toBe("encounterUuid");
      done();
    });
  });

});
