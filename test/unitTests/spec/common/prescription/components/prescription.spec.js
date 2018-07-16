'use strict';

describe('prescription', () => {

  let $componentController, controller, $http, $filter, $rootScope, $stateParams, observationsService, commonService,
    conceptService, localStorageService, notifier, drugService, prescriptionService, $q, providerService,
    sessionService, patientService, $uibModal;

  const drugPrescriptionConvSet = {
    therapeuticLine: {
      uuid: "fdff0637-b36f-4dce-90c7-fe9f1ec586f0",
      display: "LINHA TERAPEUTICA",
      answers: [
        {uuid: "a6bbe1ac-5243-40e4-98cb-7d4a1467dfbe", display: "PRIMEIRA LINHA"},
        {uuid: "7f367983-9911-4f8c-bbfc-a85678801f64", display: "SEGUNDA LINHA"},
        {uuid: "ade7656f-0ce3-461b-b7d8-121932dcd6a2", display: "TERCEIRA LINHA"},
      ]
    }
  };

  const provider = {name: 'Loria Magestade'};

  beforeEach(module('clinic', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      const deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _$httpBackend_, _$filter_, _$rootScope_, _$stateParams_,
                     _observationsService_, _commonService_, _conceptService_, _localStorageService_,
                     _notifier_, _drugService_, _prescriptionService_, _$q_,
                     _providerService_, _sessionService_, _patientService_, _$uibModal_) => {


    $componentController = _$componentController_;
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
    $uibModal = _$uibModal_;
  }));

  beforeEach(() => {
    spyOn(prescriptionService, 'getPrescriptionConvSetConcept').and.callFake(() => $q(resolve => resolve(drugPrescriptionConvSet)));

    const prescriptions = [{
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
              "uuid": "9d6b861d-10e8-11e5-9009-0242ac110014"
            }
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
        }, {
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

    spyOn(sessionService, 'getCurrentProvider').and.returnValue($q.resolve(provider));

    spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve({})));

    spyOn(prescriptionService, 'getPatientRegimen').and.returnValue($q.resolve({}));

    spyOn(drugService, 'getDrugsOfRegimen').and.returnValue($q.resolve([]));
  });

  describe('$onInit', () => {

    beforeEach(() => {
      controller = $componentController('prescription', null, {patient: {uuid: 'uuid'}});
    });

    it('should load patientPrescriptions', () => {
      controller.$onInit();
      $rootScope.$apply();
      expect(prescriptionService.getAllPrescriptions).toHaveBeenCalled();
    });

    it('should load prescriptionConvSet', () => {
      controller.$onInit();
      $rootScope.$apply();
      expect(controller.prescriptionConvSet).toEqual(drugPrescriptionConvSet);
    });

    it('should load currentProvider', () => {
      controller.$onInit();
      $rootScope.$apply();
      expect(sessionService.getCurrentProvider).toHaveBeenCalled();
    });

    it('should load the patient regimen', () => {
      controller.$onInit();
      $rootScope.$apply();
      expect(prescriptionService.getPatientRegimen).toHaveBeenCalled();
    });

    it('should load drug regimen drugs', () => {
      controller.$onInit();
      $rootScope.$apply();
      expect(drugService.getDrugsOfRegimen).toHaveBeenCalled();
    });

    describe('not in retrospectiveMode', () => {

      it('should set selected provider', () => {

        controller.$onInit();

        $rootScope.$apply();

        expect(controller.selectedProvider).toEqual(provider);

      });

    });

  });

  describe('removeAll', () => {

    beforeEach(() => {
      controller = $componentController('prescription', {
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

    it('should reset regimen', () => {
      controller.regimen = {
        drugRegimen: 'TDF+3TC+EFV',
        therapeuticLine: 'PRIMEIRA LINHA',
        artPlan: 'INICIAR',
        isArv: true,
      };
      controller.removeAll();
      expect(controller.regimen).toEqual({});
    });

  });

  describe('refill', () => {

    it('should add selected drug to current prescription', () => {
      const item = {drugOrder: {dosingInstructions: 'Empty stomach'}};
      controller = $componentController('prescription');
      controller.refill({}, item);
      expect(controller.listedPrescriptions).toContain({drugOrder: {dosingInstructions: {uuid: 'Empty stomach'}}});
    });

    it('should set regimen to regimen of selected drug', () => {

      const item = {drugOrder: {dosingInstructions: 'Empty stomach'}};
      controller = $componentController('prescription');

      const prescription = {regime: '(TDF+3TC+EFV', therapeuticLine: 'PRIMEIRA LINHA', arvPlan: 'INICIAR'};
      controller.refill(prescription, item);

      expect(controller.regimen).toEqual({
        drugRegimen: prescription.regime,
        therapeuticLine: prescription.therapeuticLine,
        artPlan: prescription.arvPlan,
        isArv: !!prescription.arvPlan,
      });

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

        controller = $componentController('prescription', {
          $scope: {}
        });
        controller.prescriptionItem = {};
      });

      it('should check a drug as ARV drug', () => {
        const drug = {"uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"};
        controller.checkDrugType(drug);
        $rootScope.$apply();
        expect(controller.prescriptionItem.isArv).toBe(true);
        expect(controller.prescriptionItem.drugOrder).toBe(null);
      });
    });

    describe('drug is not ARV', () => {
      beforeEach(() => {

        spyOn(drugService, 'isArvDrug').and.callFake(() => $q(resolve => resolve(false)));

        controller = $componentController('prescription', {
          $scope: {}
        });
        controller.prescriptionItem = {};
      });


      it('should check a drug as ARV drug', () => {
        const drug = {"uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"};
        controller.checkDrugType(drug);
        $rootScope.$apply();
        expect(controller.prescriptionItem.isArv).toBe(false);
      });
    });


  });

  describe('add', () => {

    beforeEach(() => {
      controller = $componentController('prescription', {
        $scope: {}
      });

      spyOn(notifier, 'error').and.callFake(() => {

      });
    });

    const form = {
      $valid: true,
      $setPristine: () => {
      },
      $setUntouched: () => {
      }
    };

    describe('form has validation errors', () => {
      beforeEach(() => {

        controller = $componentController('prescription', {
          $scope: {}
        });

      });
      const formError = {
        $valid: false,
        $setPristine: () => {
        },
        $setUntouched: () => {
        }
      };

      it('should not add a drug order', () => {
        controller.add(formError.$valid, formError);
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

    it('should open cancel prescription modal', () => {
      const item = {drugOrder: {action: 'NEW'}};
      const controller = $componentController('prescription', {});

      spyOn($uibModal, 'open').and.returnValue({result: $q.resolve('TOXICIDADE')});

      controller.cancelOrStop(item);

      expect($uibModal.open).toHaveBeenCalledWith(jasmine.objectContaining({component: 'cancelPrescriptionModal'}));

    });

    it('should stop prescription item', () => {

      const item = {drugOrder: {action: 'NEW'}};
      const interruptedReason = [{answers: []}];

      spyOn(notifier, 'success').and.callFake(() => {

      });

      const form = {
        $valid: true,
        $setPristine: () => {

        },
        $setUntouched: () => {

        }
      };

      controller = $componentController('prescription', {});

      controller.prescriptionConvSet.interruptedReason = interruptedReason;
      controller.listedPrescriptions = [1];

      spyOn($uibModal, 'open').and.returnValue({result: $q.resolve({cancellationReason: 'TOXICIDADE'})});

      expect(controller.listedPrescriptions.length).toBe(1);

      controller.cancelOrStop(item);

      $rootScope.$apply();
      expect(controller.listedPrescriptions.length).toBe(0);
      expect(notifier.success).toHaveBeenCalled();
      expect(prescriptionService.stopPrescriptionItem).toHaveBeenCalled();
      expect(prescriptionService.getAllPrescriptions).toHaveBeenCalled();

    });

  });


  describe('save', () => {

    const patient = {uuid: 'ac465c58-68ef-4a19-88ae-c7f72e89a2b2'};

    beforeEach(() => {

      spyOn(notifier, 'error');

      spyOn(notifier, 'success');

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({
        uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
        display: "Local Desconhecido"
      });

    });

    describe('valid prescription', () => {

      beforeEach(() => {

        spyOn(prescriptionService, 'create').and.callFake(() => $q(resolve => resolve([])));

        controller = $componentController('prescription',null, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});

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
        controller.selectedProvider = {uuid: '123'};
        controller.showNewPrescriptionsControlls = null;
      });

      it('should create a prescription', () => {
        const ctrl = $componentController('prescription', null, {patient});
        ctrl.save();
        $rootScope.$apply();
        expect(prescriptionService.create).toHaveBeenCalled();
        expect(notifier.success).toHaveBeenCalled();
      });

      describe('retrospective mode', () => {

        it('should open the date and provider modal', () => {

          const retrospectiveMode = true;

          spyOn($uibModal, 'open').and.returnValue({result: $q.resolve()});

          controller = $componentController('prescription', null, {retrospectiveMode, patient});

          controller.save();

          expect($uibModal.open).toHaveBeenCalled();
        });

        xit('should set prescription selected provider', () => {

          const date = new Date();
          const provider = {display: '290-7 - Joana Albino'};
          const retrospectiveMode = true;

          spyOn($uibModal, 'open').and.returnValue({result: $q.resolve({date, provider})});

          controller = $componentController('prescription', null, {retrospectiveMode, patient});

          controller.save();

          $rootScope.$apply();

          expect(controller.selectedProvider).toEqual(provider);

        }, 'Selected provider is set but then it is removed after save');

        it('should set prescription date', () => {

          const date = new Date();
          const provider = {display: '290-7 - Joana Albino'};
          const retrospectiveMode = true;

          spyOn($uibModal, 'open').and.returnValue({result: $q.resolve({date, provider})});

          controller = $componentController('prescription', null, {retrospectiveMode, patient});

          controller.save();

          $rootScope.$apply();

          expect(controller.prescriptionDate).toEqual(date);

        });

      });
    });

    describe('create prescription failed', () => {
      beforeEach(() => {

        spyOn(prescriptionService, 'create').and.callFake(() => $q((resolve, reject) => reject({data: {error: {message: '[]'}}})));

        controller = $componentController('prescription',null, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});

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
        controller.selectedProvider = {uuid: '123'};
        controller.showNewPrescriptionsControlls = null;
      });

      it('should not create a prescription', () => {
        controller.save();
        $rootScope.$apply();
        expect(notifier.error).toHaveBeenCalled();
      });
    });

    describe('invalid prescription', () => {

      beforeEach(() => {
        controller = $componentController('prescription',null, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});
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
      });

      it('should not create a prescription', () => {
        controller.save();
      });
    });

    describe('another active ARV prescription exists', () => {

      beforeEach(() => {
        controller = $componentController('prescription', {notifier}, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});

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
            regime: true,
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
        controller.save();
        $rootScope.$apply();
        expect(notifier.error).toHaveBeenCalled();
      });
    });

    describe('at least one item in the new prescription exists in another active prescription', () => {
      beforeEach(() => {

        controller = $componentController('prescription', {notifier}, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});
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
        controller.save();
        $rootScope.$apply();
        expect(notifier.error).toHaveBeenCalled();
      });
    });

  });

  describe('cleanDrugIfUnchecked', () => {

    beforeEach(() => {
      controller = $componentController('prescription', {
        $scope: {}
      });

      controller.prescriptionItem = {
        "isArv": false,
        "drugOrder": {"drug": {}},
        "therapeuticLine": {},
        "currentArvLine": {},
        "currentRegimen": {},
        "regime": {},
        "arvPlan": {}
      };

    });
    it('should clean ARV fields', () => {
      controller.cleanDrugIfUnchecked();
      expect(controller.prescriptionItem.arvPlan).toBe(null);
    });

  });

  describe('checkItemIsRefillable', () => {
    const prescription = {prescriptionStatus: "EXPIRED", regime: {uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b66'}};

    describe('arv regimen', () => {

      it('should return false if prescription has different drugRegimen than existing prescription', () => {
        const item = {drugOrder: {drug: {uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b69'}}};
        const newItem = {drugOrder: {drug: {uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b68'}}};
        const controller = $componentController('prescription');
        controller.regimen = {drugRegimen: {uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b67'}, isArv: true};
        controller.listedPrescriptions = [item];
        expect(controller.checkItemIsRefillable(prescription, newItem)).toBe(false);
      });

    });

    it('should return True for expired prescription status', () => {
      const controller = $componentController('prescription');
      expect(controller.checkItemIsRefillable(prescription)).toBe(true);
    });

    it('should return false if drug is already in prescription being built', () => {
      const controller = $componentController('prescription');
      const prescriptionItem = {drugOrder: {drug: {uuid: 'e1d83d4a-1d5f-11e0-b929-000c29ad1d07'}}};
      controller.listedPrescriptions = [prescriptionItem];
      expect(controller.checkItemIsRefillable(prescription, prescriptionItem)).toBe(false);
    });
  });

  describe('checkActiveAndNewItemStatus', () => {
    const item = {status: "NEW"};
    it('should return True for NEW Item status', () => {
      expect(controller.checkActiveAndNewItemStatus(item)).toBe(true);
    });
  });
});
