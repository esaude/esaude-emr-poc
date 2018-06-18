describe('encounterService', () => {

  var $httpBackend, encounterService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject((_$httpBackend_, _encounterService_) => {
    $httpBackend = _$httpBackend_;
    encounterService = _encounterService_;
  }));

  describe('create', () => {

    it('should create an encounter', () => {

      $httpBackend.expectPOST('/openmrs/ws/rest/v1/encounter', {}).respond({});

      var encounter;
      encounterService.create({}).then(created => {
        encounter = created;
      });

      $httpBackend.flush();

      expect(encounter).toEqual({});

    });
  });

  describe('get', () => {

    it('should get encounter by encounter type and representation', () => {

      var patient = "aaa-bbb-ccc";
      var encounterType = "ccc-aaa-bbb";
      var ENCOUNTER = { uuid: "UUID_1" };
      $httpBackend.expectGET('/openmrs/ws/rest/v1/encounterwrap?encounterType=ccc-aaa-bbb&patient=aaa-bbb-ccc&v=custom:(uuid,encounterDatetime,provider,voided,visit:(uuid,startDatetime,stopDatetime),obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),order:(uuid,voided,drug,quantity,dose,doseUnits,frequency,quantityUnits,dosingInstructions,duration,durationUnits,route),obsDatetime,value)))')
        .respond({ results: ENCOUNTER });

      var encounter;
      encounterService.getEncountersForEncounterType(patient, encounterType).then(created => {
        encounter = created;
      });

      $httpBackend.flush();

      expect(encounter).toEqual(ENCOUNTER);

    });

    it('should get encounter by encounter type', () => {

      var patient = "aaa-bbb-ccc";
      var encounterType = "ccc-aaa-bbb";
      var ENCOUNTER = { uuid: "UUID_1" };
      $httpBackend.expectGET('/openmrs/ws/rest/v1/encounter?encounterType=ccc-aaa-bbb&patient=aaa-bbb-ccc&v=custom:(uuid,encounterDatetime,provider,voided,obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value)))')
        .respond({ results: ENCOUNTER });

      var encounter;
      encounterService.getEncountersForEncounterType(patient, encounterType, "default").then(created => {
        encounter = created;
      });

      $httpBackend.flush();

      expect(encounter).toEqual(ENCOUNTER);

    });

  });

});
