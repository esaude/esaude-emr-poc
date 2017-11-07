describe('consultationService', function () {

  var $httpBackend, consultationService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$httpBackend_, _consultationService_) {
    $httpBackend = _$httpBackend_;
    consultationService = _consultationService_;
  }));

  var location = {uuid: 'uuid'};
  var endDate = moment('2017-11-07');
  var representation = 'custom:(consultationDate,patientConsultations:(checkInOnConsultationDate))';

  describe('getMonthlyConsultationSummary', function () {

    beforeEach(function () {
      jasmine.clock().install();
    });

    it('should load monthly patient consultation summary', function () {

      jasmine.clock().mockDate(endDate);

      var startDateStr = '07-10-2017';
      var endDateStr = '07-11-2017';

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
      jasmine.clock().install();
    });

    it('should load weekly patient consultation summary', function () {

      jasmine.clock().mockDate(endDate);

      var startDateStr = '31-10-2017';
      var endDateStr = '07-11-2017';

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
