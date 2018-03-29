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

  describe('createStarvInitialA', function () {

    describe('child patient', function () {

      it('should create encounter with encounter type S.TARV: PEDIATRIA INICIAL A', function () {

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/encounter', {
          patient: {},
          encounterType: {uuid: 'e278fa8c-1d5f-11e0-b929-000c29ad1d07'}
        }).respond({});

        var encounter;
        encounterService.createStarvInitialA({patient: {age: {years: 14}}}).then(function (created) {
          encounter = created;
        });

        $httpBackend.flush();

        expect(encounter).toEqual({})

      });

    });

    describe('adult patient', function () {

      it('should create encounter with encounter type S.TARV: ADULTO INICIAL A', function () {

        $httpBackend.expectPOST('/openmrs/ws/rest/v1/encounter', {
          patient: {},
          encounterType: {uuid: 'e278f820-1d5f-11e0-b929-000c29ad1d07'}
        }).respond({});

        var encounter;
        encounterService.createStarvInitialA({patient: {age: {years: 15}}}).then(function (created) {
          encounter = created;
        });

        $httpBackend.flush();

        expect(encounter).toEqual({})

      });

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('findStarvInitialAEncounter', function () {

    it('should not return voided encounters', function () {

      expect(encounterService.findStarvInitialAEncounter([{voided: true}])).toBeUndefined();

    });

    it('should return an encounter with encounter type S.TARV: ADULTO INICIAL A', function () {

      var encounters = [{voided: false, encounterType: {uuid: 'e278f820-1d5f-11e0-b929-000c29ad1d07'}}];

      expect(encounterService.findStarvInitialAEncounter(encounters)).toEqual(encounters[0]);

    });

    it('should return an encounter with encounter type S.TARV: PEDIATRIA INICIAL A', function () {

      var encounters = [{voided: false, encounterType: {uuid: 'e278fa8c-1d5f-11e0-b929-000c29ad1d07'}}];

      expect(encounterService.findStarvInitialAEncounter(encounters)).toEqual(encounters[0]);

    });

  });

  describe('getPatientStarvInitialAEncounters', function () {

    describe('child patient', function () {

      it('should create encounter with encounter type S.TARV: PEDIATRIA INICIAL A', function () {

        $httpBackend.expectGET('/openmrs/ws/rest/v1/encounter'
          + '?encounterType=' + 'e278fa8c-1d5f-11e0-b929-000c29ad1d07'
          + '&patient=' + 'ff36328e-f0a2-42fc-97ce-f1f7412515e1').respond([]);

        var encounters;
        encounterService.getPatientStarvInitialAEncounters({
          age: {years: 14},
          uuid: 'ff36328e-f0a2-42fc-97ce-f1f7412515e1'
        }).then(function (loaded) {
          encounters = loaded;
        });

        $httpBackend.flush();

        expect(encounters).toEqual([]);

      });

    });

    describe('adult patient', function () {

      it('should create encounter with encounter type S.TARV: ADULTO INICIAL A', function () {

        $httpBackend.expectGET('/openmrs/ws/rest/v1/encounter'
          + '?encounterType=' + 'e278f820-1d5f-11e0-b929-000c29ad1d07'
          + '&patient=' + 'ff36328e-f0a2-42fc-97ce-f1f7412515e1').respond([]);

        var encounters;
        encounterService.getPatientStarvInitialAEncounters({
          age: {years: 15},
          uuid: 'ff36328e-f0a2-42fc-97ce-f1f7412515e1'
        }).then(function (loaded) {
          encounters = loaded;
        });

        $httpBackend.flush();

        expect(encounters).toEqual([]);

      });

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
