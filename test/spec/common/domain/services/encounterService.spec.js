describe('encounterService', function () {

  var $httpBackend, encounterService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$httpBackend_, _encounterService_) {
    $httpBackend = _$httpBackend_;
    encounterService = _encounterService_;
  }));

  describe('create', function () {

    it('should create an encounter', function () {

      $httpBackend.expectPOST('/openmrs/ws/rest/v1/encounter', {}).respond({});

      var encounter;
      encounterService.create({}).then(function (created) {
        encounter = created;
      });

      $httpBackend.flush();

      expect(encounter).toEqual({});

    });
  });

});
