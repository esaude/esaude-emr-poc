'use strict';

  describe('PrescriptionController', function () {

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

  beforeEach(module('clinic', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$controller_, _$httpBackend_, _$filter_, _$rootScope_, _$stateParams_,
                              _observationsService_, _commonService_, _conceptService_, _localStorageService_,
                              _notifier_, _drugService_, _prescriptionService_, _$q_,
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

    spyOn(prescriptionService, 'getAllPrescriptions').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(prescriptions);
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
      controller = $controller('PrescriptionController', {
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
      controller = $controller('PrescriptionController', {
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
      controller = $controller('PrescriptionController', {
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

    beforeEach(function () {

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({
        uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
        display: "Local Desconhecido"
      });

      spyOn(drugService, 'getDrugStock').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        })
      });
    });
    describe('drug is an ARV', function () {
      beforeEach(function () {

        spyOn(drugService, 'isArvDrug').and.callFake(function () {
          return $q(function (resolve) {
            return resolve(true);
          })
        });

        controller = $controller('PrescriptionController', {
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

        controller = $controller('PrescriptionController', {
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

  describe('add', function () {

    beforeEach(function () {
      controller = $controller('PrescriptionController', {
        $scope: {}
      });

      spyOn(notifier, 'error').and.callFake(function () {

      });
    });

    var form = {
      $valid: true,
      $setPristine: function () {
      },
      $setUntouched: function () {
      }
    };

    describe('form has validation errors', function () {
      beforeEach(function () {

        controller = $controller('PrescriptionController', {
          $scope: {}
        });

      });
      var formError = {
        $valid: false,
        $setPristine: function () {
        },
        $setUntouched: function () {
        }
      };

      it('should not add a drug order', function () {
        controller.add(formError.$valid,  formError);
        expect(controller.showMessages).toBe(true);
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


  describe('save', function () {

    beforeEach(function () {

      controller = $controller('PrescriptionController', {
        $scope: {},
        localStorageService: localStorageService,
        prescriptionService: prescriptionService
      });

      spyOn(notifier, 'error').and.callFake(function () {
      });

      spyOn(notifier, 'success').and.callFake(function () {
      });

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({
        uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
        display: "Local Desconhecido"
      });

    });

    var form = {
      $valid: true,
      $setPristine: function () {
      },
      $setUntouched: function () {
      },
      selectedProvider: {$invalid: false}
    };

    describe('valid prescription', function () {

      beforeEach(function () {

        spyOn(prescriptionService, 'create').and.callFake(function () {
          return $q(function (resolve) {
            return resolve([]);
          })
        });

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

      it('should create a prescription', function () {
        controller.save(form);
        $rootScope.$apply();
        expect(prescriptionService.create).toHaveBeenCalled();
        expect(notifier.success).toHaveBeenCalled();
      });
    });

    describe('create prescription failed', function () {
      beforeEach(function () {

        spyOn(prescriptionService, 'create').and.callFake(function () {
          return $q(function (resolve, reject) {
            return reject({data: {error: {message: '[]'}}});
          })
        });

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

      it('should not create a prescription', function () {
        controller.save(form);
        $rootScope.$apply();
        expect(notifier.error).toHaveBeenCalled();
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

    describe('invalid prescription', function () {

      var formWithInvalidProvider = {
        $valid: true,
        $setPristine: function () {
        },
        $setUntouched: function () {
        },
        selectedProvider: {$invalid : true}
      };

      it('should not create a prescription', function () {
        controller.save(formWithInvalidProvider);
      });
    });

    describe('another active ARV prescription exists', function () {
      var form = {
        $valid: true,
        $setPristine: function () {
        },
        $setUntouched: function () {
        },
        selectedProvider: {$invalid : false}
      };



      it('should not create a prescription', function () {
        controller.save(form);
        expect(notifier.error).toHaveBeenCalled();
      });
    });

    describe('at least one item in the new prescription exists in another active prescription', function () {
      beforeEach(function () {

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

      it('should not create a prescription', function () {
        controller.save(form);
        expect(notifier.error).toHaveBeenCalled();
      });
    });

  });

  describe('cleanDrugIfUnchecked', function () {

    beforeEach(function () {
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
        }
    });
    it('should clean ARV fields', function () {
      controller.cleanDrugIfUnchecked();
      expect(controller.prescriptionItem.arvPlan).toBe(null);
    });

    });

    describe('checkItemIsRefillable', function () {
        var prescription = { prescriptionStatus: "EXPIRED"};

        it('should return True for expired prescription status', function () {
          expect(controller.checkItemIsRefillable(prescription)).toBe(true);
        });
    });

    describe('checkActiveAndNewItemStatus', function () {
      var item = { status: "NEW"};
      it('should return True for NEW Item status', function () {
        expect(controller.checkActiveAndNewItemStatus(item)).toBe(true);
      });
    });

  });
