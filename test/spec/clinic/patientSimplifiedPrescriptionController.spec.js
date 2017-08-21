'use strict';

describe('PatientSimplifiedPrescriptionController', function () {

  var $controller, controller, $http, $filter, $rootScope, $stateParams, observationsService, commonService,
    conceptService, localStorageService, notifier, spinner, drugService, prescriptionService, $q, providerService,
    sessionService, patientService;

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
                              _notifier_, _spinner_, _drugService_, _prescriptionService_, _$q_,
                              _providerService_, _sessionService_, _patientService_) {

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
    providerService = _providerService_;
    sessionService = _sessionService_;
    patientService = _patientService_;
  }));

  beforeEach(function () {
    spyOn(conceptService, 'getPrescriptionConvSetConcept').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(drugPrescriptionConvSet);
      })
    });

    spyOn(prescriptionService, 'getAllPrescriptions').and.callFake(function () {
      return $q(function (resolve) {
        return resolve([]);
      })
    });

    spyOn(conceptService, 'get').and.callFake(function () {
      return $q(function (resolve) {
        return resolve([]);
      });
    });

    spyOn(providerService, 'getProviders').and.callFake(function () {
      return $q(function (resolve) {
        return resolve([]);
      })
    });

    spyOn(sessionService, 'getCurrentProvider').and.callFake(function () {
      return $q(function (resolve) {
        return resolve([]);
      })
    });

    spyOn(patientService, 'getPatient').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      })
    });
  });

  describe('activate', function () {

    beforeEach(function () {
      controller = $controller('PatientSimplifiedPrescriptionController', {
        $scope: {},
        conceptService: conceptService,
        prescriptionService: prescriptionService
      });
    });

    it('should load the patient', function () {
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

    it('should load patientPrescriptions', function () {
      $rootScope.$apply();
      expect(prescriptionService.getAllPrescriptions).toHaveBeenCalled();
    });

    it('should set fieldModels', function () {
      $rootScope.$apply();
      expect(controller.fieldModels['dosingUnits'].model).toEqual(drugPrescriptionConvSet[0]);
    });

    it('should load currentProvider', function () {
      $rootScope.$apply();
      expect(sessionService.getCurrentProvider).toHaveBeenCalled();
    });

  });

  describe('removeAll', function () {

    beforeEach(function () {
      controller = $controller('PatientSimplifiedPrescriptionController', {
        $scope: {}
      });
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
      controller = $controller('PatientSimplifiedPrescriptionController', {
        $scope: {}
      });
    });

    it('should add selected drug to current prescription', function () {
      var item = {drugOrder: {dosingInstructions: 'Empty stomach'}};
      controller.refill(item);
      expect(controller.listedPrescriptions).toContain(item);
    });

  });

  describe('checkDrugType', function () {

    describe('drug is an ARV', function () {
      beforeEach(function () {

        spyOn(drugService, 'isArvDrug').and.callFake(function () {
          return $q(function (resolve) {
            return resolve(true);
          })
        });

        controller = $controller('PatientSimplifiedPrescriptionController', {
          $scope: {}
        });
        controller.prescriptionItem = {};
      });

      it('should check a drug as ARV drug', function () {
        var drug = {"uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"};
        controller.checkDrugType(drug);
        $rootScope.$apply();
        expect(controller.prescriptionItem.isArv).toBe(true);
        expect(controller.prescriptionItem.drugOrder).toBe(null);
      });
    });

    describe('drug is not ARV', function () {
      beforeEach(function () {

        spyOn(drugService, 'isArvDrug').and.callFake(function () {
          return $q(function (resolve) {
            return resolve(false);
          })
        });

        controller = $controller('PatientSimplifiedPrescriptionController', {
          $scope: {}
        });
        controller.prescriptionItem = {};
      });


      it('should check a drug as ARV drug', function () {
        var drug = {"uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"};
        controller.checkDrugType(drug);
        $rootScope.$apply();
        expect(controller.prescriptionItem.isArv).toBe(false);
      });
    });


  });

  describe('cancelOrStop', function () {

    beforeEach(function () {

      spyOn(prescriptionService, 'stopPrescriptionItem').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });

    });

    it('should stop prescription item', function () {

      var item = {drugOrder: {action: 'NEW'}};

      spyOn(notifier, 'success').and.callFake(function () {

      });

      var form = {
        $valid: true,
        $setPristine: function () {

        },
        $setUntouched: function () {

        }
      };

      controller = $controller('PatientSimplifiedPrescriptionController', {});

      controller.listedPrescriptions = [1];
      controller.cancelationReasonTyped = 'Mistake.';
      controller.cancelationReasonSelected = '...';

      expect(controller.listedPrescriptions.length).toBe(1);

      controller.cancelOrStop(form, item);

      $rootScope.$apply();
      expect(controller.cancelationReasonTyped).toBeFalsy();
      expect(controller.cancelationReasonSelected).toBeFalsy();
      expect(controller.listedPrescriptions.length).toBe(0);
      expect(notifier.success).toHaveBeenCalled();
      expect(prescriptionService.stopPrescriptionItem).toHaveBeenCalled();
      expect(prescriptionService.getAllPrescriptions).toHaveBeenCalled();

    });

  });


  describe('save', function () {

    beforeEach(function () {

      spyOn(prescriptionService, 'create').and.callFake(function () {

      });

      localStorageService = {
        cookie: {
          get: function () {
            return { uuid: 'xpto'};
          }
        }
      };

      controller = $controller('PatientSimplifiedPrescriptionController', {
        $scope: {},
        localStorageService: localStorageService,
        prescriptionService: prescriptionService,
      });
    });

    beforeEach(function () {
      controller.listedPrescriptions.push({
          "drugOrder": {

            "dosingInstructions": "Conforme indicado",
            "dose": 1,
            "doseUnits": {
              "uuid": "9d674660-10e8-11e5-9009-0242ac110012"
            },
            "frequency": {
              "uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"
            },
            "route": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"
            },
            "duration": 2,
            "quantityUnits": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"
            },
            "durationUnits": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"
            },
            "drug": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"
            }
          },
          "isArv": true,
          "regime": {
            "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"

          }
        });
      controller.existingPrescriptions.push({
        "prescriptionItems": [{
          "regime": {
            "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"

          }
        }],
        "prescriptionStatus": "ACTIVE"
      });
      controller.prescriptionDate = new Date();
      controller.selectedProvider = { uuid: '123'};
    });

    it('should not create prescription with validation error', function () {
      controller.save();
      expect(prescriptionService.create).not.toHaveBeenCalled();
    });

  });
});
