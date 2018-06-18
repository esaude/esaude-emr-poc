'use strict';

describe('reportService', () => {

  var PATIENT_ARV_PICKUP_HISTORY_TEMPLATE = "../common/patient/views/patient-arv-pickup-history-report.html";

  var reportService, $rootScope, $compile, $timeout, $http, $log, $q;

  var element, linkFn;

  beforeEach(module('common.patient'));

  // Provide $compile and $timeout mocks
  beforeEach(() => {
    element = {
      html: jasmine.createSpy('html').and.callFake(() => "<div>Malocy Landon</div>")
    };

    linkFn = jasmine.createSpy().and.callFake(() => element);

    module($provide => {
      $provide.value('$compile', jasmine.createSpy().and.callFake(() => linkFn));
    });
  });

  beforeEach(inject((_reportService_, _$httpBackend_, _$rootScope_, _$compile_, _$log_,
                     _$q_, _$timeout_) => {
    reportService = _reportService_;
    $http = _$httpBackend_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $log = _$log_;
    $q = _$q_;
  }));

  describe('generate patient ARV pickup history report', () => {

    var loadTemplate;

    beforeEach(() => {
      loadTemplate = $http.expectGET(PATIENT_ARV_PICKUP_HISTORY_TEMPLATE);
    });

    it('should generate report', () => {
      var patient = {
        fullName: "Malocy Landon",
        dispensations: [],
        address: {
          address1: "Rua de Kongwa",
          address3: "130",
          address5: "Central",
          address6: null,
          countyDistrict: "Mutarara",
          stateProvince: "Tete",
          country: "Mocambique"
        }
      };
      patient.startDate = moment('2017-10-18').toDate();
      patient.endDate = moment('2018-10-18').toDate();
      var template = "<div>{{patient.fullName}}</div>";

      loadTemplate.respond(200, template);

      reportService.printPatientARVPickupHistory(patient);
      $http.flush();
      $timeout.flush();

      expect($compile).toHaveBeenCalled();
      expect(linkFn).toHaveBeenCalled();
      expect(element.html).toHaveBeenCalled();
    });

    it('should cancel report generation if load fails', () => {
      var patient = {
        fullName: "Malocy Landon",
        dispensations: [],
        address: {
          address1: "Rua de Kongwa",
          address3: "130",
          address5: "Central",
          address6: null,
          countyDistrict: "Mutarara",
          stateProvince: "Tete",
          country: "Mocambique"
        }
      };
      patient.startDate = moment('2017-10-18').toDate();
      patient.endDate = moment('2018-10-18').toDate();

      loadTemplate.respond(404, 'Not Found');

      spyOn($log, "error").and.callThrough();
      spyOn($q, "reject").and.callThrough();

      reportService.printPatientARVPickupHistory(patient);
      $http.flush();
      $timeout.flush();

      expect($log.error).toHaveBeenCalled();
      expect($q.reject).toHaveBeenCalled();
      expect($compile).not.toHaveBeenCalled();
      expect(linkFn).not.toHaveBeenCalled();
      expect(element.html).not.toHaveBeenCalled();
    });
  });

  afterEach(() => {
    $http.verifyNoOutstandingExpectation();
    $http.verifyNoOutstandingRequest();
  });
});
