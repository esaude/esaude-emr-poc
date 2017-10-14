describe("observationsService", function () {
  var observationsService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_observationsService_, $httpBackend) {
      observationsService = _observationsService_;
      $http = $httpBackend
    }
  ));

  it('should fetch vitals based on concept', function () {
      var queryConcepts = '/openmrs/ws/rest/v1/obs?concept=e1da52ba-1d5f-11e0-b929-000c29ad1d07&patient=93ed1593-1173-42ec-ad9d-31757d32720f&v=custom:(uuid,display,encounter:(encounterDatetime,encounterType,provider:(display,uuid)),voided,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value))';
      var conceptUUid = 'e1da52ba-1d5f-11e0-b929-000c29ad1d07';
      var dummyUuid = '93ed1593-1173-42ec-ad9d-31757d32720f';


      $http.expectGET(queryConcepts).respond({results:[]});

      observationsService.getObs(dummyUuid, conceptUUid);

      $http.flush();

  });

});
