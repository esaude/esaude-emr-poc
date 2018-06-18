describe('testOrderResultService', () => {

  var $q, testOrderResultService, $httpBackend;

  beforeEach(module('lab', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_testOrderResultService_, _$q_, _$httpBackend_) => {
    $q = _$q_;
    testOrderResultService = _testOrderResultService_;
    $httpBackend = _$httpBackend_;
  }));


  describe('getTestOrderResultsForPatient', () => {

    it('should load the patients test order results', () => {

      var patient = { uuid: '02be1844-761e-4722-ab1b-320fb1cbc5a6' };

      var testOrderResults = [{ uuid: "d3da5962-f7a8-46da-9207-f5e8fda4d435" }];

      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult?patient=' + patient.uuid).respond({ results: testOrderResults });

      var results;
      testOrderResultService.getTestOrderResultsForPatient(patient).then(r => {
        results = r;
      });

      $httpBackend.flush();

      expect(results).toEqual([{ uuid: "d3da5962-f7a8-46da-9207-f5e8fda4d435" }]);

    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getTestOrderResult', () => {

    it('should load the test order result', () => {

      var uuid = '6a19b385-223f-45eb-8a8f-bf7b142ecde9';

      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult/' + uuid).respond({ uuid: uuid });

      var testOrderResult;
      testOrderResultService.getTestOrderResult(uuid).then(r => {
        testOrderResult = r;
      });

      $httpBackend.flush();

      expect(testOrderResult).toEqual({ uuid: uuid });

    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
