'use strict';

describe('reportService', function () {

  var PATIENT_ARV_PICKUP_HISTORY_TEMPLATE = "../patient-details/views/patient-arv-pickup-history-report.html";

  var reportService, encounterService, $rootScope, $compile, $timeout, $http, $log, $q;

  var linkFn;

  beforeEach(module('patient.details'));

  // Provide appService mock (usualy run as route resolve)
  beforeEach(module(function ($provide) {
    var appService = jasmine.createSpyObj('appService', ['getAppDescriptor']);
    appService.getAppDescriptor.and.returnValue({
      getConfigValue: function () {
        return {
          pharmacy: "mockPharmacyPickupEncounter"
        }
      }
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

  beforeEach(inject(function (_reportService_, _encounterService_, _$httpBackend_, _$rootScope_, _$compile_, _$log_,
                              _$q_, _$timeout_) {
    reportService = _reportService_;
    encounterService = _encounterService_;
    $http = _$httpBackend_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $log = _$log_;
    $q = _$q_;
  }));

  describe('generate patient ARV pickup history report', function () {

    var loadTemplate, getPharmacyPickups;

    beforeEach(function () {
      getPharmacyPickups = $http.expectRoute('GET', Bahmni.Common.Constants.encounterUrl);
      loadTemplate = $http.expectGET(PATIENT_ARV_PICKUP_HISTORY_TEMPLATE);
    });

    it('should generate report', function () {
      var patient = {fullName: "Malocy Landon"};
      var template = "<div>{{patient.fullName}}</div>";

      spyOn(encounterService, "getPatientPharmacyEncounters").and.callThrough();
      getPharmacyPickups.respond(200, [{}]);
      loadTemplate.respond(200, template);

      reportService.printPatientARVPickupHistory(patient);
      $http.flush();

      expect(encounterService.getPatientPharmacyEncounters).toHaveBeenCalled();
      expect($compile).toHaveBeenCalled();
      expect(linkFn).toHaveBeenCalled();
      expect($timeout).toHaveBeenCalled();
    });

    it('should cancel report generation if load fails', function () {
      getPharmacyPickups.respond(200, [{}]);
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
