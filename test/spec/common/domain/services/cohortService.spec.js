describe('cohortService', function () {

  var cohortService, $httpBackend;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$httpBackend_, _cohortService_) {
    cohortService = _cohortService_;
    $httpBackend = _$httpBackend_;
  }));

  fdescribe('getWithParams', function () {

    var uuid = 'some-uuid';

    var params = {foo: 'bar'};

    it('should get cohort by uuid with parameters', function () {

      var result;

      $httpBackend.expectGET("/openmrs/ws/rest/v1/reportingrest/cohort/" + uuid+ "?foo=" + params.foo).respond({});

      cohortService.getWithParams(uuid, params).success(function (ret) {
        result = ret;
      });


      $httpBackend.flush();
      expect(result).toBeDefined();

    });

  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
