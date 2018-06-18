'use strict';

  describe('PrescriptionController', () => {

  var $controller, controller, $http, $filter, $rootScope, $stateParams, observationsService, commonService,
    conceptService, localStorageService, notifier, drugService, prescriptionService, $q, providerService,
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

  beforeEach(module('clinic', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$controller_, _$httpBackend_, _$filter_, _$rootScope_, _$stateParams_,
                     _observationsService_, _commonService_, _conceptService_, _localStorageService_,
                     _notifier_, _drugService_, _prescriptionService_, _$q_,
                     _providerService_, _sessionService_, _patientService_) => {

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
    drugService = _drugService_;
    prescriptionService = _prescriptionService_;
    $q = _$q_;
    providerService = _providerService_;
    sessionService = _sessionService_;
    patientService = _patientService_;
  }));

  beforeEach(() => {
    spyOn(conceptService, 'getPrescriptionConvSetConcept').and.callFake(() => $q(resolve => resolve(drugPrescriptionConvSet)));

    var prescriptions = [{
      "prescriptionItems": [{
        "drugOrder": {
          "drug": {
            "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"
          }
        },
        "status": "ACTIVE"
      },
        {
          "drugOrder": {
            "drug": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110013"
            }
          },
          "status": "FINALIZED"
        },
        {
          "drugOrder": {
            "drug": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110014"}
          },
          "status": "EXPIRED"
        },
        {
          "drugOrder": {
            "drug": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110015"
            }
          },
          "status": "INTERRUPTED"
        },{
          "drugOrder": {
            "drug": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110015"
            }
          },
          "status": "NEW"
        }],
      "prescriptionDate": ""
    }];

    spyOn(prescriptionService, 'getAllPrescriptions').and.callFake(() => $q(resolve => resolve(prescriptions)));

    spyOn(conceptService, 'get').and.callFake(() => $q(resolve => resolve([])));

    spyOn(providerService, 'getProviders').and.callFake(() => $q(resolve => resolve([])));

    spyOn(sessionService, 'getCurrentProvider').and.callFake(() => $q(resolve => resolve([])));

    spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve({})));
  });

  describe('activate', () => {

    beforeEach(() => {
      controller = $controller('PrescriptionController', {
        $scope: {},
        conceptService: conceptService,
        prescriptionService: prescriptionService
      });
    });

    it('should load the patient', () => {
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

    it('should load patientPrescriptions', () => {
      $rootScope.$apply();
      expect(prescriptionService.getAllPrescriptions).toHaveBeenCalled();
    });

    it('should set fieldModels', () => {
      $rootScope.$apply();
      expect(controller.fieldModels['dosingUnits'].model).toEqual(drugPrescriptionConvSet[0]);
    });

    it('should load currentProvider', () => {
      $rootScope.$apply();
      expect(sessionService.getCurrentProvider).toHaveBeenCalled();
    });

  });

  describe('removeAll', () => {

    beforeEach(() => {
      controller = $controller('PrescriptionController', {
        $scope: {}
      });
    });

    beforeEach(() => {
      controller.listedPrescriptions.push(1);
      controller.listedPrescriptions.push(2);
      controller.showNewPrescriptionsControlls = true;
    });

    it('should remove all listed drugs', () => {
      expect(controller.listedPrescriptions.length).not.toBe(0);
      controller.removeAll();
      expect(controller.listedPrescriptions.length).toBe(0);
    });

    it('should hide controls', () => {
      expect(controller.showNewPrescriptionsControlls).not.toBe(false);
      controller.removeAll();
      expect(controller.showNewPrescriptionsControlls).toBe(false);
    });

  });

  describe('refill', () => {

    beforeEach(() => {
      controller = $controller('PrescriptionController', {
        $scope: {}
      });
    });

    it('should add selected drug to current prescription', () => {
      var item = {drugOrder: {dosingInstructions: 'Empty stomach'}};
      controller.refill(item);
      expect(controller.listedPrescriptions).toContain(item);
    });

  });

  describe('checkDrugType', () => {

    beforeEach(() => {

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({
        uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
        display: "Local Desconhecido"
      });

      spyOn(drugService, 'getDrugStock').and.callFake(() => $q(resolve => resolve([])));
    });
    describe('drug is an ARV', () => {
      beforeEach(() => {

        spyOn(drugService, 'isArvDrug').and.callFake(() => $q(resolve => resolve(true)));

        controller = $controller('PrescriptionController', {
          $scope: {}
        });
        controller.prescriptionItem = {};
      });

      it('should check a drug as ARV drug', () => {
        var drug = {"uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"};
        controller.checkDrugType(drug);
        $rootScope.$apply();
        expect(controller.prescriptionItem.isArv).toBe(true);
        expect(controller.prescriptionItem.drugOrder).toBe(null);
      });
    });

    describe('drug is not ARV', () => {
      beforeEach(() => {

        spyOn(drugService, 'isArvDrug').and.callFake(() => $q(resolve => resolve(false)));

        controller = $controller('PrescriptionController', {
          $scope: {}
        });
        controller.prescriptionItem = {};
      });


      it('should check a drug as ARV drug', () => {
        var drug = {"uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"};
        controller.checkDrugType(drug);
        $rootScope.$apply();
        expect(controller.prescriptionItem.isArv).toBe(false);
      });
    });


  });

  describe('add', () => {

    beforeEach(() => {
      controller = $controller('PrescriptionController', {
        $scope: {}
      });

      spyOn(notifier, 'error').and.callFake(() => {

      });
    });

    var form = {
      $valid: true,
      $setPristine: () => {
      },
      $setUntouched: () => {
      }
    };

    describe('form has validation errors', () => {
      beforeEach(() => {

        controller = $controller('PrescriptionController', {
          $scope: {}
        });

      });
      var formError = {
        $valid: false,
        $setPristine: () => {
        },
        $setUntouched: () => {
        }
      };

      it('should not add a drug order', () => {
        controller.add(formError.$valid,  formError);
        expect(controller.showMessages).toBe(true);
        });
    });

  });


  describe('cancelOrStop', () => {

    beforeEach(() => {

      spyOn(prescriptionService, 'stopPrescriptionItem').and.callFake(() => $q(resolve => {
        resolve();
      }));

    });

    it('should stop prescription item', () => {

      var item = {drugOrder: {action: 'NEW'}};

      spyOn(notifier, 'success').and.callFake(() => {

      });

      var form = {
        $valid: true,
        $setPristine: () => {

        },
        $setUntouched: () => {

        }
      };

      controller = $controller('PrescriptionController', {});

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


  describe('save', () => {

    beforeEach(() => {

      controller = $controller('PrescriptionController', {
        $scope: {},
        localStorageService: localStorageService,
        prescriptionService: prescriptionService
      });

      spyOn(notifier, 'error').and.callFake(() => {
      });

      spyOn(notifier, 'success').and.callFake(() => {
      });

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({
        uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
        display: "Local Desconhecido"
      });

    });

    var form = {
      $valid: true,
      $setPristine: () => {
      },
      $setUntouched: () => {
      },
      selectedProvider: {$invalid: false}
    };

    describe('valid prescription', () => {

      beforeEach(() => {

        spyOn(prescriptionService, 'create').and.callFake(() => $q(resolve => resolve([])));

        controller = $controller('PrescriptionController', {
          $scope: {},
          localStorageService: localStorageService,
          prescriptionService: prescriptionService
        });

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
          }
        });
        controller.prescriptionDate = new Date();
        controller.selectedProvider = { uuid: '123'};
        controller.showNewPrescriptionsControlls = null;
      });

      it('should create a prescription', () => {
        controller.save(form);
        $rootScope.$apply();
        expect(prescriptionService.create).toHaveBeenCalled();
        expect(notifier.success).toHaveBeenCalled();
      });
    });

    describe('create prescription failed', () => {
      beforeEach(() => {

        spyOn(prescriptionService, 'create').and.callFake(() => $q((resolve, reject) => reject({data: {error: {message: '[]'}}})));

        controller = $controller('PrescriptionController', {
          $scope: {},
          localStorageService: localStorageService,
          prescriptionService: prescriptionService
        });

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
          }
        });
        controller.prescriptionDate = new Date();
        controller.selectedProvider = { uuid: '123'};
        controller.showNewPrescriptionsControlls = null;
      });

      it('should not create a prescription', () => {
        controller.save(form);
        $rootScope.$apply();
        expect(notifier.error).toHaveBeenCalled();
      });
    });

    beforeEach(() => {
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

          },
          "drugOrder": {
            "drug": {
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"
            }
          }
        }],
        "prescriptionStatus": "ACTIVE"
      });
      controller.prescriptionDate = new Date();
      controller.selectedProvider = { uuid: '123'};
    });

    describe('invalid prescription', () => {

      var formWithInvalidProvider = {
        $valid: true,
        $setPristine: () => {
        },
        $setUntouched: () => {
        },
        selectedProvider: {$invalid : true}
      };

      it('should not create a prescription', () => {
        controller.save(formWithInvalidProvider);
      });
    });

    describe('another active ARV prescription exists', () => {
      var form = {
        $valid: true,
        $setPristine: () => {
        },
        $setUntouched: () => {
        },
        selectedProvider: {$invalid : false}
      };



      it('should not create a prescription', () => {
        controller.save(form);
        expect(notifier.error).toHaveBeenCalled();
      });
    });

    describe('at least one item in the new prescription exists in another active prescription', () => {
      beforeEach(() => {

        controller = $controller('PrescriptionController', {
          $scope: {},
          localStorageService: localStorageService,
          prescriptionService: prescriptionService
        });
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
          }
        });
        controller.existingPrescriptions.push({
          "prescriptionItems": [{
            "drugOrder": {
              "drug": {
                "uuid": "9d6b861d-10e8-11e5-9009-0242ac110012"
              }
            },
            "status": "ACTIVE"
          }]
        });

      });

      it('should not create a prescription', () => {
        controller.save(form);
        expect(notifier.error).toHaveBeenCalled();
      });
    });

  });

  describe('cleanDrugIfUnchecked', () => {

    beforeEach(() => {
      controller = $controller('PrescriptionController', {
        $scope: {}
      });

      controller.prescriptionItem = {
        "isArv" : false,
        "drugOrder" : { "drug" : {}},
        "therapeuticLine": {},
        "currentArvLine" : {},
        "currentRegimen" : {},
        "regime" : {},
        "arvPlan" : {}
        };
    });
    it('should clean ARV fields', () => {
      controller.cleanDrugIfUnchecked();
      expect(controller.prescriptionItem.arvPlan).toBe(null);
    });

    });

    describe('checkItemIsRefillable', () => {
        var prescription = { prescriptionStatus: "EXPIRED"};

        it('should return True for expired prescription status', () => {
          expect(controller.checkItemIsRefillable(prescription)).toBe(true);
        });
    });

    describe('checkActiveAndNewItemStatus', () => {
      var item = { status: "NEW"};
      it('should return True for NEW Item status', () => {
        expect(controller.checkActiveAndNewItemStatus(item)).toBe(true);
      });
    });

  });
