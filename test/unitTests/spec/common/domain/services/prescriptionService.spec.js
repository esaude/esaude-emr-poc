'use strict';

describe('prescriptionService', function () {

  var prescriptionService, encounterService, conceptService, appService, $http, $q, $log, $rootScope;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_prescriptionService_, _encounterService_, _conceptService_, _appService_, _$q_, _$rootScope_,
                              _$httpBackend_) {
    prescriptionService = _prescriptionService_;
    encounterService = _encounterService_;
    conceptService = _conceptService_;
    appService = _appService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = _$httpBackend_;
  }));

  describe('getAllPrescriptions', function () {

    var patient = {uuid: "4d499e76-618c-11e7-907b-a6006ad3dba0", age: {years: 26}};

    beforeEach(function () {
      spyOn(encounterService, 'getPatientFollowupEncounters').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(encounters);
        });
      });

      spyOn(conceptService, 'getPrescriptionConvSetConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(drugPrescriptionConvSet);
        });
      });

      spyOn(appService, 'getAppDescriptor').and.returnValue({
        getDrugMapping: function () {
          return [{
            arvDrugs: {}
          }];
        }
      });
    });

    it('should get the patient prescriptions', function () {

      var loadedPrescriptions = {};

      $http.expectGET('/openmrs/ws/rest/v1/prescription?findAllPrescribed=true&patient=' + patient.uuid + '&v=full').respond([]);

      prescriptionService.getAllPrescriptions(patient).then(function (prescriptions) {
        loadedPrescriptions = prescriptions;
      });

      $http.flush();
    });


    afterEach(function() {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('create', function () {

    var prescription = {
      prescriptionItems: []
    };

    beforeEach(function () {
      $http.expectPOST('/openmrs/ws/rest/v1/prescription')
        .respond(prescription);
    });

    it('should create a prescription', function () {
      var created = {};
      prescriptionService.create(prescription).then(function (p) {
        created = p;
      });

      $http.flush();
      expect(created).toEqual(prescription);
    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

});
