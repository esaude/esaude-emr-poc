describe("observationsService", () => {

  var $httpBackend, observationsService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject((_$httpBackend_, _observationsService_) => {
    observationsService = _observationsService_;
    $httpBackend = _$httpBackend_;
  }));

  describe('createObs', () => {

    it('should create an obs', () => {

      $httpBackend.expectPOST('/openmrs/ws/rest/v1/obs', {concept: '4cd975c4-56b8-478b-a528-d8ffb9ecd200'}).respond({});

      var obs;
      observationsService.createObs({concept: '4cd975c4-56b8-478b-a528-d8ffb9ecd200'}).then(created => {
        obs = created;
      });

      $httpBackend.flush();

      expect(obs).toBeDefined();

    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('deleteObs', () => {

    it('should delete an obs', () => {

      $httpBackend.expectDELETE('/openmrs/ws/rest/v1/obs/6eb3404f-cb51-41ec-a6cb-3b865f4c766d').respond();

      observationsService.deleteObs({uuid: '6eb3404f-cb51-41ec-a6cb-3b865f4c766d'});

      $httpBackend.flush();

    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
