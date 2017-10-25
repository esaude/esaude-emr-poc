describe('patientService', function () {

  var patientService, $httpBackend, $rootScope, openmrsPatientMapper, reportService, prescriptionService,
    updatePatientMapper;

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_patientService_, _prescriptionService_, _reportService_, _$rootScope_,
                              _$httpBackend_, _openmrsPatientMapper_, _updatePatientMapper_) {
    patientService = _patientService_;
    prescriptionService = _prescriptionService_;
    reportService = _reportService_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    openmrsPatientMapper = _openmrsPatientMapper_;
    updatePatientMapper = _updatePatientMapper_;
  }));

  it("should fetch the the specific patient by name ", function () {

    var query = 'mal';

    $httpBackend.expectGET('/openmrs/ws/rest/v1/patient/?identifier=' + query + '&q=mal&v=full')
      .respond({});

    patientService.search(query);

    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  describe('printPatientARVPickupHistory', function () {

    var year = 2017;
    var patientUUID = '';
    var pickups = [];

    it('should print the report', function () {

      spyOn(openmrsPatientMapper, 'map').and.returnValue({});

      spyOn(reportService, 'printPatientARVPickupHistory').and.callFake(function () {
      });

      $httpBackend.expectGET('/openmrs/ws/rest/v1/patient/?v=full')
        .respond({});

      $httpBackend.expectGET('/openmrs/ws/rest/v1/prescription?findAllActive=true&patient=&v=full')
        .respond([]);

      patientService.printPatientARVPickupHistory(year, patientUUID, pickups);

      $httpBackend.flush();
      expect(reportService.printPatientARVPickupHistory).toHaveBeenCalled();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

  describe('update', function () {

    beforeEach(function () {
      $rootScope.patientConfiguration = {personAttributeTypes: []};
    });

    var openMRSPatient = {uuid: 'e2bc2a32-1d5f-11e0-b929-000c29ad1d07'};

    var identifier = {uuid: '84047c69-1e50-431e-88d9-b8bc58799079', identifier: '123456789X', preferred: true};

    var identifier2 = {uuid: '84047c69-1e50-431e-88d9-b8bc58799079', identifier: '123456789Z', preferred: false};

    var patient = {uuid: 'e2bc2a32-1d5f-11e0-b929-000c29ad1d07', identifiers: [identifier]};

    describe('identifiers changed', function () {

      it('should patient patient and update identifiers', function () {

        var patientJson = {
          patient: patient,
          changedIdentifiers: [identifier2],
          voidedIdentifiers: [],
          addedIdentifiers: []
        };

        spyOn(updatePatientMapper, 'map').and.returnValue(patientJson);

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patientprofile/' + openMRSPatient.uuid, patientJson.patient)
          .respond({patient: patient});

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patient/' + openMRSPatient.uuid + '/identifier/' + identifier.uuid)
          .respond(identifier2);

        var patientProfile = {};
        patientService.update(patient, openMRSPatient).then(function (updatedPatientProfile) {
          patientProfile = updatedPatientProfile;
        });

        $httpBackend.flush();
        $rootScope.$apply();
        expect(updatePatientMapper.map).toHaveBeenCalled();
        expect(patientProfile.patient.identifiers[0].identifier).toEqual(identifier2.identifier);
        expect(patientProfile.patient.identifiers[0].preferred).toEqual(identifier2.preferred);

      });

    });

    describe('identifiers voided', function () {

      it('should update patient and void identifiers', function () {

        var patientJson = {
          patient: patient,
          changedIdentifiers: [],
          voidedIdentifiers: [identifier2],
          addedIdentifiers: []
        };

        spyOn(updatePatientMapper, 'map').and.returnValue(patientJson);

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patientprofile/' + openMRSPatient.uuid, patientJson.patient)
          .respond({patient: patient});

        $httpBackend.expectDELETE('/openmrs/ws/rest/v1/patient/' + openMRSPatient.uuid + '/identifier/' + identifier.uuid)
          .respond({});

        var patientProfile = {};
        patientService.update(patient, openMRSPatient).then(function (updatedPatientProfile) {
          patientProfile = updatedPatientProfile;
        });

        $httpBackend.flush();
        expect(updatePatientMapper.map).toHaveBeenCalled();
      });

    });

    describe('identifiers added', function () {

      it('should update patient and create identifiers', function () {

        var patientJson = {
          patient: patient,
          changedIdentifiers: [],
          voidedIdentifiers: [],
          addedIdentifiers: [identifier2]
        };

        spyOn(updatePatientMapper, 'map').and.returnValue(patientJson);

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patientprofile/' + openMRSPatient.uuid, patientJson.patient)
          .respond({patient: patient});

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patient/' + openMRSPatient.uuid + '/identifier/', identifier2)
          .respond({});

        var patientProfile = {};
        patientService.update(patient, openMRSPatient).then(function (updatedPatientProfile) {
          patientProfile = updatedPatientProfile;
        });

        $httpBackend.flush();
        expect(updatePatientMapper.map).toHaveBeenCalled();
      });

    });


    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
