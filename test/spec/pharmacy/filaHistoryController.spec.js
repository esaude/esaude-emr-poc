describe('FilaHistoryController', function () {

  var $q, $httpBackend, $rootScope, $controller, controller, encounterService, patientService, prescriptionService, reportService;

  var stateParams = {'patientUuid': '0810aecc-6642-4c1c-ac1e-537a0cfed81'};

  var encounters = [
    {"encounterDatetime": new Date("2018-08-28")},
    {"encounterDatetime": new Date("2017-07-05")},
    {"encounterDatetime": new Date("2016-06-04")},
    {"encounterDatetime": new Date("2016-05-03")},
    {"encounterDatetime": new Date("2015-05-02")}
  ];

  beforeEach(module('pharmacy', function ($provide, $translateProvider) {
    // Mock initialization
    $provide.factory('initialization', function () {});
    // Mock appService
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: function (fn) {}
    });
    $provide.value('appService', appService);
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
  }));

  beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _$httpBackend_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(function () {
    encounterService = jasmine.createSpyObj('encounterService', ['getPatientPharmacyEncounters']);
    encounterService.getPatientPharmacyEncounters.and.returnValue({
      then: function (fn) {
        fn(encounters);
      }
    });

    patientService = jasmine.createSpyObj('patientService', ['getPatient']);
    patientService.getPatient.and.callFake(function () {
      return $q(function (resolve) {
        resolve({});
      });
    });

    prescriptionService = jasmine.createSpyObj('prescriptionService', ['getPatientPrescriptions']);
    prescriptionService.getPatientPrescriptions.and.callFake(function () {
      return $q(function (resolve) {
        resolve([]);
      });
    });

    reportService = jasmine.createSpyObj('reportService', ['printPatientARVPickupHistory']);
    reportService.printPatientARVPickupHistory.and.callFake(function () {});
  });

  beforeEach(function () {
    controller = $controller('FilaHistoryController', {
      $statePrams: stateParams,
      encounterService: encounterService,
      patientService: patientService,
      reportService: reportService,
      prescriptionService: prescriptionService
    });
  });

  describe('activate', function () {

    it('should load patient pharmacy encounters', function () {
      expect(encounterService.getPatientPharmacyEncounters).toHaveBeenCalled();
    });

    it('should display the most recent pickups', function () {
      expect(controller.displayedPickups).toEqual(encounters);
      expect(controller.filteredPickups).toEqual([encounters[0]]);
      expect(controller.year).toBe(encounters[0].encounterDatetime.getFullYear());
    });

  });

  describe('onDateChange', function () {

    it('should filter pickups by date range', function () {
      expect(controller.filteredPickups).toEqual([encounters[0]]);

      controller.year = 2016;
      controller.onDateChange();

      expect(controller.filteredPickups.length).toBe(2);
      expect(controller.filteredPickups[0]).toBe(encounters[2]);
      expect(controller.filteredPickups[1]).toBe(encounters[3]);
    });

    it('should set pickups to empty when year is too low', function () {
      expect(controller.filteredPickups).toEqual([encounters[0]]);

      controller.year = 2014;
      controller.onDateChange();

      expect(controller.filteredPickups.length).toBe(0);
    });
  });

  describe('onPrint', function () {

    it('should load the patient', function () {

      controller.onPrint();

      expect(patientService.getPatient).toHaveBeenCalled();
    });

    it('should load the patient prescriptions', function () {

      controller.onPrint();

      expect(prescriptionService.getPatientPrescriptions).toHaveBeenCalled();
    });

    it('should print pickup history report', function () {

      controller.onPrint();

      $rootScope.$apply();
      expect(reportService.printPatientARVPickupHistory).toHaveBeenCalled();
    });
  })
});
