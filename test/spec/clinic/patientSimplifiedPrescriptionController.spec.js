'use strict';

describe('PatientSimplifiedPrescriptionController', function () {

  var $controller, controller, $http, $filter, $rootScope, $stateParams, observationsService, commonService,
    conceptService, localStorageService, notifier, spinner, drugService, prescriptionService, $q;

  var drugPrescriptionConvSet = [
    {
      display: "dosingUnits",
      answers: [
        {display: "ml", uuid: "9d68af32-10e8-11e5-9009-0242ac110012"},
        {display: "mg", uuid: "9d68ef86-10e8-11e5-9009-0242ac110012"}
      ],
      uuid: "9d66a447-10e8-11e5-9009-0242ac110012"
    }
  ];

  beforeEach(module('clinic', function ($provide, $translateProvider) {
    // Mock initialization
    $provide.factory('initialization', function () {
    });
    // Mock appService
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: function (fn) {
      }
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

  beforeEach(inject(function (_$controller_, _$httpBackend_, _$filter_, _$rootScope_, _$stateParams_,
                              _observationsService_, _commonService_, _conceptService_, _localStorageService_,
                              _notifier_, _spinner_, _drugService_, _prescriptionService_, _$q_) {

    $controller = _$controller_;
    $http = _$httpBackend_;
    $filter = _$filter_;
    $rootScope = _$rootScope_;
    $stateParams = _$stateParams_;
    observationsService = _observationsService_;
    commonService = _commonService_;
    conceptService = _conceptService_;
    localStorageService = _localStorageService_;
    notifier = _notifier_;
    spinner = _spinner_;
    drugService = _drugService_;
    prescriptionService = _prescriptionService_;
    $q = _$q_;
  }));

  beforeEach(function () {
    spyOn(conceptService, 'getPrescriptionConvSetConcept').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(drugPrescriptionConvSet);
      })
    });

    spyOn(prescriptionService, 'getPatientPrescriptions').and.callFake(function () {
      return $q(function (resolve) {
        return resolve([]);
      })
    });

    spyOn(conceptService, 'get').and.callFake(function () {
      return $q(function (resolve) {
        return resolve([]);
      });
    })
  });

  describe('activate', function () {

    beforeEach(function () {
      controller = $controller('PatientSimplifiedPrescriptionController', {
        conceptService: conceptService,
        prescriptionService: prescriptionService
      });
    });

    it('should load prescriptionConvSetConcept', function () {
      $rootScope.$apply();
      expect(conceptService.getPrescriptionConvSetConcept).toHaveBeenCalled();
    });

    it('should set fieldModels', function () {
      $rootScope.$apply();
      expect(controller.fieldModels['dosingUnits'].model).toEqual(drugPrescriptionConvSet[0]);
    });

  });

  describe('removeAll', function () {

    beforeEach(function () {
      controller = $controller('PatientSimplifiedPrescriptionController', {});
    });

    beforeEach(function () {
      controller.listedPrescriptions.push(1);
      controller.listedPrescriptions.push(2);
      controller.showNewPrescriptionsControlls = true;
    });

    it('should remove all listed drugs', function () {
      expect(controller.listedPrescriptions.length).not.toBe(0);
      controller.removeAll();
      expect(controller.listedPrescriptions.length).toBe(0);
    });

    it('should hide controls', function () {
      expect(controller.showNewPrescriptionsControlls).not.toBe(false);
      controller.removeAll();
      expect(controller.showNewPrescriptionsControlls).toBe(false);
    });

  });

  describe('refill', function () {

    beforeEach(function () {
      controller = $controller('PatientSimplifiedPrescriptionController', {});
    });

    it('should add selected drug to current prescription', function () {
      var drug = {'name': 'paracetamol'};
      controller.refill(drug);
      expect(controller.listedPrescriptions).toContain(drug);
    });

  });

});
