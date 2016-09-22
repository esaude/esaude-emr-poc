'use strict';
//TODO: Finalize address hierachy calls
xdescribe('configurationService', function () {
  var offlineDbService;
  var $q= Q;

  beforeEach(module('bahmni.common.config'));
  beforeEach(module('bahmni.common.domain'));

  beforeEach(module(function ($provide) {
    offlineDbService = jasmine.createSpyObj('offlineDbService',['getReferenceData']);
    $provide.value('$q', $q);
    //$provide.value('offlineDbService', offlineDbService);
  }));

  var configurationservice;

  beforeEach(inject(function (_configurationService_) {
    configurationservice = _configurationService_;

  }));

  it('should fetch addressLevels from  offline db', function (done) {
    var addressLevels = {
      "data": {
        "results": [
          {
            name: "State",
            addressField: "stateProvince",
            required: false
          }]}
    };

    offlineDbService.getReferenceData.and.returnValue(specUtil.respondWithPromise($q, addressLevels));
    configurationservice.getConfigurations(['addressLevels']).then(function (result) {
      expect(result.addressLevels.results.length).toBe(1);
      expect(result.addressLevels.results[0].name).toBe("State");
      done();
    });

  });

});
