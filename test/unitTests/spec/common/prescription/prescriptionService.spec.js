'use strict';

describe('prescriptionService', () => {

  var prescriptionService, encounterService, conceptService, appService, $http, $q, $log, $rootScope;

  beforeEach(module('poc.common.prescription'));

  beforeEach(inject((_prescriptionService_, _encounterService_, _conceptService_, _appService_, _$q_, _$rootScope_,
                     _$httpBackend_) => {
    prescriptionService = _prescriptionService_;
    encounterService = _encounterService_;
    conceptService = _conceptService_;
    appService = _appService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = _$httpBackend_;
  }));

  describe('getAllPrescriptions', () => {

    var patient = {uuid: "4d499e76-618c-11e7-907b-a6006ad3dba0", age: {years: 26}};

    beforeEach(() => {
      spyOn(encounterService, 'getPatientFollowupEncounters').and.callFake(() => $q(resolve => resolve(encounters)));

      spyOn(appService, 'getAppDescriptor').and.returnValue({
        getDrugMapping: () => [{
          arvDrugs: {}
        }]
      });
    });

    it('should get the patient prescriptions', () => {

      var loadedPrescriptions = {};

      $http.expectGET('/openmrs/ws/rest/v1/prescription?findAllPrescribed=true&patient=' + patient.uuid + '&v=full').respond([]);

      prescriptionService.getAllPrescriptions(patient).then(prescriptions => {
        loadedPrescriptions = prescriptions;
      });

      $http.flush();
    });


    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('create', () => {

    var prescription = {
      prescriptionItems: []
    };

    beforeEach(() => {
      $http.expectPOST('/openmrs/ws/rest/v1/prescription')
        .respond(prescription);
    });

    it('should create a prescription', () => {
      var created = {};
      prescriptionService.create(prescription).then(p => {
        created = p;
      });

      $http.flush();
      expect(created).toEqual(prescription);
    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

});
