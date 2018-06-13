describe('filaHistory', function () {

  var $componentController, controller, encounterService, patientService, dispensationService, $q, $rootScope, $http;

  var stateParams = { 'patientUuid': '0810aecc-6642-4c1c-ac1e-537a0cfed81' };

  var encounters = [
    { "encounterDatetime": new Date("2018-08-28") },
    { "encounterDatetime": new Date("2017-07-05") },
    { "encounterDatetime": new Date("2016-06-04") },
    { "encounterDatetime": new Date("2016-05-03") },
    { "encounterDatetime": new Date("2015-05-02") }
  ];

  var groupedDispensations = [
    { dispensationItems: [1, 2] },
    { dispensationItems: [3] }
  ];

  beforeEach(module('pharmacy', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_$componentController_, _dispensationService_, _$q_, _$rootScope_, $httpBackend, _patientService_) {
    $componentController = _$componentController_;
    dispensationService = _dispensationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = $httpBackend;
    patientService = _patientService_;
  }));

  beforeEach(function () {
    encounterService = jasmine.createSpyObj('encounterService', ['getPatientPharmacyEncounters']);
    encounterService.getPatientPharmacyEncounters.and.returnValue({
      then: function (fn) {
        fn(encounters);
      }
    });

    spyOn(patientService, 'printPatientARVPickupHistory').and.callFake(function () { });

    spyOn(dispensationService, 'getDispensation').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(groupedDispensations);
      });
    });

  });

  beforeEach(function () {

    $http.expectGET("/poc_config/openmrs/i18n/common/locale_pt.json").respond({});

    controller = $componentController('filaHistory', null, {patient: {uuid: '1234'}});

    $rootScope.$apply();
  });

  describe('updateResults', function () {

    it('should load dispensations', function () {

      controller.updateResults();

      $rootScope.$apply();
      expect(dispensationService.getDispensation).toHaveBeenCalled();
      expect(controller.groupedDispensations).toBe(groupedDispensations);
      expect(controller.displayedPickups).toEqual([1, 2, 3]);
    });

  });

  describe('onStartDateChange', function () {

    it('should change end date to be one year from start date', function () {
      controller.startDate = moment('2017-10-18').toDate();
      controller.onStartDateChange();
      expect(controller.endDate).toEqual(moment('2018-10-18').toDate());
    });

  });

  describe('onPrint', function () {

    it('should print patient ARV pickup history report', function () {
      controller.onPrint();
      expect(patientService.printPatientARVPickupHistory).toHaveBeenCalled();
    });

    it('should not print when date range is more than one year', function () {
      controller.startDate = moment('2017-10-18').toDate();
      controller.endDate = moment('2018-11-18').toDate();
      controller.onPrint();
      expect(patientService.printPatientARVPickupHistory).not.toHaveBeenCalled();
    });

  });
});
