describe('testOrderResultService', function () {

  var $q, testOrderResultService, $httpBackend;

  beforeEach(module('lab', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function(_testOrderResultService_, _$q_, _$httpBackend_) {
    $q = _$q_;
    testOrderResultService = _testOrderResultService_;
    $httpBackend = _$httpBackend_;
  }));


  describe('getTestOrderResultsForPatient', function () {

    it('should load the patients test order results', function () {

      var patient = {uuid: '02be1844-761e-4722-ab1b-320fb1cbc5a6'};

      var testOrderResults = [{uuid: "d3da5962-f7a8-46da-9207-f5e8fda4d435"}];

      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult?patient=' + patient.uuid).respond({results: testOrderResults});

      var results;
      testOrderResultService.getTestOrderResultsForPatient(patient).then(function (r) {
        results = r;
      });

      $httpBackend.flush();

      expect(results).toEqual([{uuid: "d3da5962-f7a8-46da-9207-f5e8fda4d435"}])

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getTestOrderResult', function () {

    it('should load the test order result', function () {

      var uuid = '6a19b385-223f-45eb-8a8f-bf7b142ecde9';

      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult/' + uuid).respond({uuid: uuid});

      var testOrderResult;
      testOrderResultService.getTestOrderResult(uuid).then(function (r) {
        testOrderResult = r;
      });

      $httpBackend.flush();

      expect(testOrderResult).toEqual({uuid: uuid});

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
