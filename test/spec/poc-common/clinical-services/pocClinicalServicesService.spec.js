'use strict';

describe('pocClinicalServiceService', function () {

  var pocClinicalServiceService, $http;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_pocClinicalServiceService_, $httpBackend) {
    pocClinicalServiceService = _pocClinicalServiceService_;
    $http = $httpBackend;
  }));

  var openmrsUrl = "/openmrs/ws/rest/v1/clinicalservice";
  var response = [];

  describe('deleteService', function () {

    var requestDetails = {clinicalservice: "clinicalServiceUuid", encounter: "encounterUuid"};

    beforeEach(function () {
      $http.expectGET(openmrsUrl + '?clinicalservice=' + requestDetails.clinicalservice + '&encounter=' + requestDetails.encounter)
      .respond(response);
    });

    it('should call end service url in delete clinical service service', function () {
      var resolve;
      pocClinicalServiceService.deleteService(requestDetails.clinicalservice, requestDetails.encounter).then(function (response) {
        resolve = response;
      });

      $http.flush();
      expect(resolve.data).toEqual(response);
    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

});