describe('consultationService', function () {

  var $httpBackend, consultationService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$httpBackend_, _consultationService_) {
    $httpBackend = _$httpBackend_;
    consultationService = _consultationService_;
  }));

  var location = {uuid: 'uuid'};
  var endDate = new Date('2017-11-07 00:00:00');
  var representation = 'custom:(consultationDate,patientConsultations:(checkInOnConsultationDate))';

  describe('getMonthlyConsultationSummary', function () {

    beforeEach(function () {
      jasmine.clock().mockDate(endDate);
    });

    it('should load monthly patient consultation summary', function () {

      var startDateStr = new Date('2017-10-07 00:00:00').toISOString();
      var endDateStr = new Date('2017-11-07 00:00:00').toISOString();

      $httpBackend.expectGET('/openmrs/ws/rest/v1/patientconsultationsummary?endDate=' + endDateStr
          + '&location=' + location.uuid + '&startDate=' + startDateStr + '&v=' + representation)
        .respond({results: []});

      consultationService.getMonthlyConsultationSummary(location);

      $httpBackend.flush();

    });

    afterEach(function () {
      jasmine.clock().uninstall();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getWeeklyConsultationSummary', function () {

    beforeEach(function () {
      jasmine.clock().mockDate(endDate);
    });

    it('should load weekly patient consultation summary', function () {

      var startDateStr = new Date('2017-10-31 00:00:00').toISOString();
      var endDateStr = new Date('2017-11-07 00:00:00').toISOString();

      $httpBackend.expectGET('/openmrs/ws/rest/v1/patientconsultationsummary?endDate=' + endDateStr
        + '&location=' + location.uuid + '&startDate=' + startDateStr + '&v=' + representation)
        .respond({results: []});

      consultationService.getWeeklyConsultationSummary(location);

      $httpBackend.flush();

    });

    afterEach(function () {
      jasmine.clock().uninstall();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });


});
