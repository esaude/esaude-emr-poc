describe('cohortService', () => {

  var cohortService, $httpBackend;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject((_$httpBackend_, _cohortService_) => {
    cohortService = _cohortService_;
    $httpBackend = _$httpBackend_;
  }));

  xdescribe('getMarkedForConsultationToday', () => {

  });

});
