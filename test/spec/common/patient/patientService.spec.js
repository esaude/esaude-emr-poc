describe('patientService', function () {

  var patientService, $httpBackend, $rootScope, openmrsPatientMapper, reportService, prescriptionService;

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_patientService_, _prescriptionService_, _reportService_, _$rootScope_,
                              _$httpBackend_, _openmrsPatientMapper_) {
    patientService = _patientService_;
    prescriptionService = _prescriptionService_;
    reportService = _reportService_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    openmrsPatientMapper = _openmrsPatientMapper_;
  }));

  it("should fetch the the specific patient by name ", function () {

    var query = 'mal';

    $httpBackend.expectGET('/openmrs/ws/rest/v1/patient?identifier=' + query + '&q=mal&v=full')
      .respond({});

    patientService.search(query);

    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('printPatientARVPickupHistory', function () {

    var year = 2017;
    var patientUUID = '';
    var pickups = [];

    it('should print the report', function () {

      spyOn(openmrsPatientMapper, 'map').and.returnValue({});

      spyOn(reportService, 'printPatientARVPickupHistory').and.callFake(function () {});

      $httpBackend.expectGET('/openmrs/ws/rest/v1/patient/?v=full')
        .respond({});

      $httpBackend.expectGET('/openmrs/ws/rest/v1/prescription?findAllActive=true&patient=&v=full')
        .respond([]);

      patientService.printPatientARVPickupHistory(year, patientUUID, pickups);

      $httpBackend.flush();
      expect(reportService.printPatientARVPickupHistory).toHaveBeenCalled();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});
