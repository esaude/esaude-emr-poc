'use strict';

describe("observationsService", function () {
  var mockBackend, observationsService;

  beforeEach(function () {
    module('bahmni.common.domain');
    inject(function (_observationsService_, $httpBackend) {
      observationsService = _observationsService_;
      mockBackend = $httpBackend
    });
  });

  describe("fetchForPatient", function () {
    it("should fetch observations for encounter", function () {
      mockBackend
        .expectGET('/openmrs/ws/rest/v1/bahmnicore/observations?concept=concept+name&patientUuid=encounterUuid')
        .respond({results: ["Some data"]});

      observationsService.fetch("encounterUuid", ["concept name"]).then(function (response) {
        expect(response.data.results.length).toBe(1);
        expect(response.data.results[0]).toBe("Some data");

      });

      mockBackend.flush();
    })
  });

});
