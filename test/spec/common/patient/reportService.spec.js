'use strict';

describe('reportService', function () {

  var PATIENT_ARV_PICKUP_HISTORY_TEMPLATE = "../patient-details/views/patient-arv-pickup-history-report.html";

  var reportService, $rootScope, $compile, $timeout, $http, $log, $q;

  var linkFn;

  beforeEach(module('common.patient', function ($provide) {
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: function (fn) {}
    });
    $provide.value('appService', appService);
  }));

  // Provide $compile and $timeout mocks
  beforeEach(function () {
    var element = {
      html: function () { return "<div>Malocy Landon</div>" }
    };

    linkFn = jasmine.createSpy().and.callFake(function () {
      return element;
    });

    module(function ($provide) {
      $provide.value('$compile', jasmine.createSpy().and.callFake(function() {
        return linkFn;
      }));
      $provide.value('$timeout', jasmine.createSpy().and.callFake(function (fn) {
        return fn();
      }));
    });
  });

  beforeEach(inject(function (_reportService_, _$httpBackend_, _$rootScope_, _$compile_, _$log_,
                              _$q_, _$timeout_) {
    reportService = _reportService_;
    $http = _$httpBackend_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $log = _$log_;
    $q = _$q_;
  }));

  describe('generate patient ARV pickup history report', function () {

    var loadTemplate;

    beforeEach(function () {
      loadTemplate = $http.expectGET(PATIENT_ARV_PICKUP_HISTORY_TEMPLATE);
    });

    it('should generate report', function () {
      var patient = {fullName: "Malocy Landon"};
      var template = "<div>{{patient.fullName}}</div>";

      loadTemplate.respond(200, template);

      reportService.printPatientARVPickupHistory(patient);
      $http.flush();

      expect($compile).toHaveBeenCalled();
      expect(linkFn).toHaveBeenCalled();
      expect($timeout).toHaveBeenCalled();
    });

    it('should cancel report generation if load fails', function () {
      loadTemplate.respond(404, 'Not Found');

      spyOn($log, "error").and.callThrough();
      spyOn($q, "reject").and.callThrough();

      reportService.printPatientARVPickupHistory({});
      $http.flush();

      expect($log.error).toHaveBeenCalled();
      expect($q.reject).toHaveBeenCalled();
      expect($compile).not.toHaveBeenCalled();
      expect(linkFn).not.toHaveBeenCalled();
      expect($timeout).not.toHaveBeenCalled();
    });
  });

  afterEach(function() {
    $http.verifyNoOutstandingExpectation();
    $http.verifyNoOutstandingRequest();
  });
});
