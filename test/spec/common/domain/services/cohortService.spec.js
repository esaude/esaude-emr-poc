describe('cohortService', function () {

  var cohortService, $httpBackend;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$httpBackend_, _cohortService_) {
    cohortService = _cohortService_;
    $httpBackend = _$httpBackend_;
  }));

  xdescribe('getMarkedForConsultationToday', function () {

  });

});
