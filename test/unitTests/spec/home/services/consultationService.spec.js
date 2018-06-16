describe('consultationService', function () {

  var $httpBackend, consultationService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$httpBackend_, _consultationService_) {
    $httpBackend = _$httpBackend_;
    consultationService = _consultationService_;
  }));

  var location = { uuid: 'uuid' };
  var summary = {
    startDate: '2017-10-07T00:00:00.000+0200',
    endDate: '2017-11-07T00:00:00.000+0200',
    patientConsultations: []
  };

  describe('getMonthlyConsultationSummary', function () {

    it('should load monthly patient consultation summary', function () {
      $httpBackend.expectGET('/openmrs/ws/rest/v1/patientconsultationsummary?location=uuid&montly=true&v=custom:(consultationDate,startDate,endDate,patientConsultations:(checkInOnConsultationDate))')
        .respond({
          results: [summary]
        });
      consultationService.getMonthlyConsultationSummary(location);
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getWeeklyConsultationSummary', function () {

    it('should load weekly patient consultation summary', function () {
      $httpBackend.expectGET('/openmrs/ws/rest/v1/patientconsultationsummary?location=uuid&montly=false&v=custom:(consultationDate,startDate,endDate,patientConsultations:(checkInOnConsultationDate))')
        .respond({
          results: [summary]
        });
      consultationService.getWeeklyConsultationSummary(location);
      $httpBackend.flush();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });


});
