'use strict';

describe('prescriptionService', () => {

  var prescriptionService, encounterService, conceptService, appService, $httpBackend, $q, $log, $rootScope;

  beforeEach(module('poc.common.prescription'));

  beforeEach(inject((_prescriptionService_, _encounterService_, _conceptService_, _appService_, _$q_, _$rootScope_,
                     _$httpBackend_) => {
    prescriptionService = _prescriptionService_;
    encounterService = _encounterService_;
    conceptService = _conceptService_;
    appService = _appService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
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

      $httpBackend.expectGET('/openmrs/ws/rest/v1/prescription?findAllPrescribed=true&patient=' + patient.uuid + '&v=full').respond([]);

      prescriptionService.getAllPrescriptions(patient).then(prescriptions => {
        loadedPrescriptions = prescriptions;
      });

      $httpBackend.flush();
    });


    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('create', () => {

    var prescription = {
      prescriptionItems: []
    };

    beforeEach(() => {
      $httpBackend.expectPOST('/openmrs/ws/rest/v1/prescription')
        .respond(prescription);
    });

    it('should create a prescription', () => {
      var created = {};
      prescriptionService.create(prescription).then(p => {
        created = p;
      });

      $httpBackend.flush();
      expect(created).toEqual(prescription);
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getPatientRegimen', () => {

    describe('patient with no art prescriptions', () => {

      it('should load regimen with first therapeutic line', () => {

        const patient = {uuid: '7551eff1-7da2-47ba-a4c9-cf6e4b20a572'};

        $httpBackend.expectGET(`/openmrs/ws/rest/v1/prescription?findAllPrescribed=true&patient=${patient.uuid}&v=full`).respond([]);

        const firstLine = {uuid: 'a6bbe1ac-5243-40e4-98cb-7d4a1467dfbe', display: 'PRIMEIRA LINHA'};
        spyOn(conceptService, 'getConcept').and.returnValue($q.resolve(firstLine));

        let regimen;
        prescriptionService.getPatientRegimen(patient).then((r) => {
          regimen = r;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(regimen).toEqual({therapeuticLine: firstLine, regime: null, arvPlan: null});

      });

    });

  });

});
