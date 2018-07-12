describe('patientService', () => {

  var patientService, $httpBackend, $rootScope, openmrsPatientMapper, reportService,
    updatePatientMapper, appService;

  beforeEach(module('common.patient'));

  beforeEach(inject((_patientService_, _reportService_, _$rootScope_,
                     _$httpBackend_, _openmrsPatientMapper_, _updatePatientMapper_, _appService_) => {
    patientService = _patientService_;
    reportService = _reportService_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    openmrsPatientMapper = _openmrsPatientMapper_;
    updatePatientMapper = _updatePatientMapper_;
    appService = _appService_;
  }));

  it("should fetch the the specific patient by name ", () => {

    var query = 'mal';

    $httpBackend.expectGET('/openmrs/ws/rest/v1/patient/?identifier=' + query + '&q=mal&v=full')
      .respond({});

    patientService.search(query);

    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  describe('printPatientARVPickupHistory', () => {

    var year = 2017;
    var patientUUID = '';
    var pickups = [];

    it('should print the report', () => {

      spyOn(openmrsPatientMapper, 'map').and.returnValue({});


      spyOn(reportService, 'printPatientARVPickupHistory').and.callFake(() => { });

      $httpBackend.expectGET('/openmrs/ws/rest/v1/patient/2017?v=full')
        .respond({});

      patientService.printPatientARVPickupHistory(year, patientUUID, pickups);

      $httpBackend.flush();
      expect(reportService.printPatientARVPickupHistory).toHaveBeenCalled();
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

  describe('update', () => {

    beforeEach(() => {
      spyOn(appService, 'getPatientConfiguration').and.returnValue({ personAttributeTypes: [] });
    });

    var openMRSPatient = { uuid: 'e2bc2a32-1d5f-11e0-b929-000c29ad1d07' };

    var identifier = { uuid: '84047c69-1e50-431e-88d9-b8bc58799079', identifier: '123456789X', preferred: true };

    var identifier2 = { uuid: '84047c69-1e50-431e-88d9-b8bc58799079', identifier: '123456789Z', preferred: false };

    var patient = { uuid: 'e2bc2a32-1d5f-11e0-b929-000c29ad1d07', identifiers: [identifier] };

    describe('identifiers changed', () => {

      it('should patient patient and update identifiers', () => {

        var patientJson = {
          patient: patient,
          changedIdentifiers: [identifier2],
          voidedIdentifiers: [],
          addedIdentifiers: []
        };

        spyOn(updatePatientMapper, 'map').and.returnValue(patientJson);

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patientprofile/' + openMRSPatient.uuid, patientJson.patient)
          .respond({ patient: patient });

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patient/' + openMRSPatient.uuid + '/identifier/' + identifier.uuid)
          .respond(identifier2);

        var patientProfile = {};
        patientService.updatePatientProfile(patient, openMRSPatient).then(updatedPatientProfile => {
          patientProfile = updatedPatientProfile;
        });

        $httpBackend.flush();
        $rootScope.$apply();
        expect(updatePatientMapper.map).toHaveBeenCalled();
        expect(patientProfile.patient.identifiers[0].identifier).toEqual(identifier2.identifier);
        expect(patientProfile.patient.identifiers[0].preferred).toEqual(identifier2.preferred);

      });

    });

    describe('identifiers voided', () => {

      it('should update patient and void identifiers', () => {

        var patientJson = {
          patient: patient,
          changedIdentifiers: [],
          voidedIdentifiers: [identifier2],
          addedIdentifiers: []
        };

        spyOn(updatePatientMapper, 'map').and.returnValue(patientJson);

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patientprofile/' + openMRSPatient.uuid, patientJson.patient)
          .respond({ patient: patient });

        $httpBackend.expectDELETE('/openmrs/ws/rest/v1/patient/' + openMRSPatient.uuid + '/identifier/' + identifier.uuid)
          .respond({});

        var patientProfile = {};
        patientService.updatePatientProfile(patient, openMRSPatient).then(updatedPatientProfile => {
          patientProfile = updatedPatientProfile;
        });

        $httpBackend.flush();
        expect(updatePatientMapper.map).toHaveBeenCalled();
      });

    });

    describe('identifiers added', () => {

      it('should update patient and create identifiers', () => {

        var patientJson = {
          patient: patient,
          changedIdentifiers: [],
          voidedIdentifiers: [],
          addedIdentifiers: [identifier2]
        };

        spyOn(updatePatientMapper, 'map').and.returnValue(patientJson);

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patientprofile/' + openMRSPatient.uuid, patientJson.patient)
          .respond({ patient: patient });

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/patient/' + openMRSPatient.uuid + '/identifier/', identifier2)
          .respond({});

        var patientProfile = {};
        patientService.updatePatientProfile(patient, openMRSPatient).then(updatedPatientProfile => {
          patientProfile = updatedPatientProfile;
        });

        $httpBackend.flush();
        expect(updatePatientMapper.map).toHaveBeenCalled();
      });

    });


    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('createPatientProfile', () => {

    var patientToCreate = {
      identifiers: [
        {
          identifier: "12345678/12/12345",
          identifierType: { uuid: "e2b966d0-1d5f-11e0-b929-000c29ad1d07" }
        }]
    };

    it('should not create patient when NID already exist', () => {

      spyOn(appService, 'getPatientConfiguration').and.returnValue([
        { uuid: "d82b0cf4-26cc-11e8-bdc0-2b5ea141f82e", sortWeight: 1, name: "Alcunha", description: "Patient's nick name", format: "java.lang.String" },
        { uuid: "d10628a7-ba75-4495-840b-bf6f1c44fd2d", sortWeight: 2, name: "Proveniência", description: "", format: "org.openmrs.Concept" },
      ]);

      $httpBackend.expectGET('/openmrs/ws/rest/v1/patient/?identifier=12345678%2F12%2F12345&q=12345678%2F12%2F12345&v=full')
        .respond({ results: [{ uuid: "UUID_1" }] });

      var error;
      patientService.createPatientProfile(patientToCreate).catch(e => {
        error = e;
      });

      $httpBackend.flush();

      expect(error).toEqual("PATIENT_WITH_SAME_NID_EXISTS");
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

});
