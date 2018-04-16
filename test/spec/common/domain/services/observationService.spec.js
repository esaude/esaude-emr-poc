describe("observationsService", function () {

  var $httpBackend, observationsService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$httpBackend_, _observationsService_) {
    observationsService = _observationsService_;
    $httpBackend = _$httpBackend_;
  }));

  describe('createObs', function () {

    it('should create an obs', function () {

      $httpBackend.expectPOST('/openmrs/ws/rest/v1/obs', {concept: '4cd975c4-56b8-478b-a528-d8ffb9ecd200'}).respond({});

      var obs;
      observationsService.createObs({concept: '4cd975c4-56b8-478b-a528-d8ffb9ecd200'}).then(function (created) {
        obs = created;
      });

      $httpBackend.flush();

      expect(obs).toBeDefined();

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('deleteObs', function () {

    it('should delete an obs', function () {

      $httpBackend.expectDELETE('/openmrs/ws/rest/v1/obs/6eb3404f-cb51-41ec-a6cb-3b865f4c766d').respond();

      observationsService.deleteObs({uuid: '6eb3404f-cb51-41ec-a6cb-3b865f4c766d'});

      $httpBackend.flush();

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
