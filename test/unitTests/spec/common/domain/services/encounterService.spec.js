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

  describe('get', function () {

    it('should get encounter by encounter type and representation', function () {

      var patient = "aaa-bbb-ccc";
      var encounterType = "ccc-aaa-bbb";
      var ENCOUNTER = { uuid: "UUID_1" };
      $httpBackend.expectGET('/openmrs/ws/rest/v1/encounterwrap?encounterType=ccc-aaa-bbb&patient=aaa-bbb-ccc&v=custom:(uuid,encounterDatetime,provider,voided,visit:(uuid,startDatetime,stopDatetime),obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),order:(uuid,voided,drug,quantity,dose,doseUnits,frequency,quantityUnits,dosingInstructions,duration,durationUnits,route),obsDatetime,value)))')
        .respond({ results: ENCOUNTER });

      var encounter = null;
      encounterService.getEncountersForEncounterType(patient, encounterType).then(function (created) {
        encounter = created;
      });

      $httpBackend.flush();

      expect(encounter).toEqual(ENCOUNTER);

    });

    it('should get encounter by encounter type', function () {

      var patient = "aaa-bbb-ccc";
      var encounterType = "ccc-aaa-bbb";
      var ENCOUNTER = { uuid: "UUID_1" };
      $httpBackend.expectGET('/openmrs/ws/rest/v1/encounter?encounterType=ccc-aaa-bbb&patient=aaa-bbb-ccc&v=custom:(uuid,encounterDatetime,provider,voided,obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value)))')
        .respond({ results: ENCOUNTER });

      var encounter;
      encounterService.getEncountersForEncounterType(patient, encounterType, "default").then(function (created) {
        encounter = created;
      });

      $httpBackend.flush();

      expect(encounter).toEqual(ENCOUNTER);

    });

  });

});
