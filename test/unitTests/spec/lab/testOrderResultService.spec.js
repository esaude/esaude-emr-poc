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

  beforeEach(inject(function (_testOrderResultService_, _$q_, _$httpBackend_) {
    $q = _$q_;
    testOrderResultService = _testOrderResultService_;
    $httpBackend = _$httpBackend_;
  }));


  describe('getTestOrderResultsForPatient', function () {

    it('should load the patients test order results', function () {

      var patient = { uuid: '02be1844-761e-4722-ab1b-320fb1cbc5a6' };

      var testOrderResults = [{ uuid: "d3da5962-f7a8-46da-9207-f5e8fda4d435" }];

      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult?patient=' + patient.uuid).respond({ results: testOrderResults });

      var results;
      testOrderResultService.getTestOrderResultsForPatient(patient).then(function (r) {
        results = r;
      });

      $httpBackend.flush();

      expect(results).toEqual([{ uuid: "d3da5962-f7a8-46da-9207-f5e8fda4d435" }])

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getTestOrderResult', function () {

    it('should load the test order result', function () {

      var uuid = '6a19b385-223f-45eb-8a8f-bf7b142ecde9';

      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult/' + uuid).respond({ uuid: uuid });

      var testOrderResult;
      testOrderResultService.getTestOrderResult(uuid).then(function (r) {
        testOrderResult = r;
      });

      $httpBackend.flush();

      expect(testOrderResult).toEqual({ uuid: uuid });

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getTestOrderConsolidateResult', function () {

    it('should return result with proper structure for coded test order', function () {
      var answer1 = { uuid: "ANSWER1_UUID" };
      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult/REQUEST_UUID')
        .respond({ items: [{ uuid: "ORDER_UUID", value: "ANSWER1_UUID" }] });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/order/ORDER_UUID')
        .respond({ concept: { uuid: "CONCEPT_UUID" } });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/concept/CONCEPT_UUID?v=custom:(uuid,display,answers,datatype,units)')
        .respond({
          datatype: { name: "Coded" },
          answers: [answer1]
        });
      var result;
      testOrderResultService.getTestOrderConsolidateResult('REQUEST_UUID', 'ORDER_UUID').then(function (r) {
        result = r;
      });
      $httpBackend.flush();
      expect(result.value).toEqual("ANSWER1_UUID");
      expect(result.codedValue).toEqual(answer1);
      expect(result.unit).toBeNull();
      expect(result.numeric).toEqual(false);
    });

    it('should return choose the correct answer', function () {
      var answer1 = { uuid: "ANSWER1_UUID" };
      var answer2 = { uuid: "ANSWER2_UUID" };
      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult/REQUEST_UUID')
        .respond({ items: [{ uuid: "ORDER_UUID", value: "ANSWER1_UUID" }] });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/order/ORDER_UUID')
        .respond({ concept: { uuid: "CONCEPT_UUID" } });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/concept/CONCEPT_UUID?v=custom:(uuid,display,answers,datatype,units)')
        .respond({
          datatype: { name: "Coded" },
          answers: [answer2, answer1]
        });
      var result;
      testOrderResultService.getTestOrderConsolidateResult('REQUEST_UUID', 'ORDER_UUID').then(function (r) {
        result = r;
      });
      $httpBackend.flush();
      expect(result.value).toEqual("ANSWER1_UUID");
    });

    it('should return result with proper structure for numeric test order', function () {
      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult/REQUEST_UUID')
        .respond({ items: [{ uuid: "ORDER_UUID", value: 20 }] });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/order/ORDER_UUID')
        .respond({ concept: { uuid: "CONCEPT_UUID" } });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/concept/CONCEPT_UUID?v=custom:(uuid,display,answers,datatype,units)')
        .respond({
          datatype: { name: "Numeric" },
          units: "g"
        });
      var result;
      testOrderResultService.getTestOrderConsolidateResult('REQUEST_UUID', 'ORDER_UUID').then(function (r) {
        result = r;
      });
      $httpBackend.flush();
      expect(result.value).toEqual(20);
      expect(result.codedValue).toBeNull();
      expect(result.unit).toEqual("g");
      expect(result.numeric).toEqual(true);
    });

    it('should choose the correct test order', function () {
      var testOrder1 = { uuid: "ORDER1_UUID", value: 20 };
      var testOrder2 = { uuid: "ORDER2_UUID", value: 25 };
      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult/REQUEST_UUID')
        .respond({ items: [testOrder1, testOrder2] });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/order/ORDER2_UUID')
        .respond({ concept: { uuid: "CONCEPT_UUID" } });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/concept/CONCEPT_UUID?v=custom:(uuid,display,answers,datatype,units)')
        .respond({
          datatype: { name: "Numeric" },
          units: "g"
        });
      var result;
      testOrderResultService.getTestOrderConsolidateResult('REQUEST_UUID', 'ORDER2_UUID').then(function (r) {
        result = r;
      });
      $httpBackend.flush();
      expect(result.value).toEqual(25);
    });

    it('should return null result if no value is available', function () {
      var testOrder1 = { uuid: "ORDER1_UUID" };
      $httpBackend.expectGET('/openmrs/ws/rest/v1/testorderresult/REQUEST_UUID')
        .respond({ items: [testOrder1] });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/order/ORDER1_UUID')
        .respond({ concept: { uuid: "CONCEPT_UUID" } });
      $httpBackend.expectGET('/openmrs/ws/rest/v1/concept/CONCEPT_UUID?v=custom:(uuid,display,answers,datatype,units)')
        .respond({
          datatype: { name: "Numeric" },
          units: "g"
        });
      var result;
      testOrderResultService.getTestOrderConsolidateResult('REQUEST_UUID', 'ORDER1_UUID').then(function (r) {
        result = r;
      });
      $httpBackend.flush();
      expect(result).toBeNull();
    });

  });

});
