'use strict';

describe('prescription', () => {

  let $componentController, ctrl, $http, $filter, $rootScope, $stateParams, observationsService, commonService,
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

    spyOn(prescriptionService, 'getPatientRegimen').and.returnValue($q.resolve({drugRegimen: {uuid: '9dc17c1b-7b6d-488e-a38d-505a7b65ec82'}}));

    spyOn(drugService, 'getDrugsOfRegimen').and.returnValue($q.resolve([]));
  });

  describe('$onInit', () => {

    beforeEach(() => {
      ctrl = $componentController('prescription', null, {patient: {uuid: 'uuid'}});
    });

    it('should load patientPrescriptions', () => {
      ctrl.$onInit();
      $rootScope.$apply();
      expect(prescriptionService.getAllPrescriptions).toHaveBeenCalled();
    });

    it('should load prescriptionConvSet', () => {
      ctrl.$onInit();
      $rootScope.$apply();
      expect(ctrl.prescriptionConvSet).toEqual(drugPrescriptionConvSet);
    });

    it('should load currentProvider', () => {
      ctrl.$onInit();
      $rootScope.$apply();
      expect(sessionService.getCurrentProvider).toHaveBeenCalled();
    });

    describe('not in retrospectiveMode', () => {

      it('should set selected provider', () => {

        ctrl.$onInit();

        $rootScope.$apply();

        expect(ctrl.selectedProvider).toEqual(provider);

      });

    });

  });

  describe('remove', () => {

    describe('all arv items removed', () => {

      it('should reset prescription regimen', () => {

        const item = 1;
        const ctrl = $componentController('prescription');

        ctrl.prescription.regime = {therapeuticLine: {display: 'PRIMEIRA LINHA'}};

        ctrl.prescription.arvItems = [item];

        ctrl.remove(item);

        expect(ctrl.prescription.regime).toBeNull();

      });

    });

  });

  describe('removeAll', () => {

    beforeEach(() => {
      ctrl = $componentController('prescription', {
        $scope: {}
      });
    });

    beforeEach(() => {
      ctrl.prescription.items.push(1);
      ctrl.prescription.items.push(2);
      ctrl.showNewPrescriptionsControlls = true;
    });

    it('should remove all listed drugs', () => {
      expect(ctrl.prescription.items.length).not.toBe(0);
      ctrl.removeAll();
      expect(ctrl.prescription.items.length).toBe(0);
    });

    it('should hide controls', () => {
      expect(ctrl.showNewPrescriptionsControlls).not.toBe(false);
      ctrl.removeAll();
      expect(ctrl.showNewPrescriptionsControlls).toBe(false);
    });

    it('should reset regime', () => {
      ctrl.regime = {display: 'TDF+3TC+EFV'};
      ctrl.removeAll();
      expect(ctrl.regime).toBeNull();
    });

    it('should reset therapeuticLine', () => {
      ctrl.therapeuticLine = {display : 'PRIMEIRA LINHA'};
      ctrl.removeAll();
      expect(ctrl.therapeuticLine).toEqual({});
    });

    it('should reset arvPlan', () => {
      ctrl.arvPlan = {display : 'INICIAR'};
      ctrl.removeAll();
      expect(ctrl.arvPlan).toEqual({});
    });

    it('should reset regime change reason', () => {
      ctrl.changeReason = {display : 'MOTIVOS'};
      ctrl.removeAll();
      expect(ctrl.changeReason).toEqual({});
    });

    it('should reset arv plan interrution reason', () => {
      ctrl.interruptionReason = {display : 'TOXICIDADE'};
      ctrl.removeAll();
      expect(ctrl.interruptionReason).toEqual({});
    });

    it('should reset regime from prescription', () => {
      ctrl.prescription.regime = {display: 'TDF+3TC+EFV'};
      ctrl.removeAll();
      expect(ctrl.prescription.regime).toBeNull();
    });

    it('should reset therapeuticLine from prescription', () => {
      ctrl.prescription.therapeuticLine = {display : 'PRIMEIRA LINHA'};
      ctrl.removeAll();
      expect(ctrl.prescription.therapeuticLine).toEqual({});
    });

    it('should reset arvPlan from prescription', () => {
      ctrl.arvPlan = {display : 'INICIAR'};
      ctrl.removeAll();
      expect(ctrl.prescription.arvPlan).toEqual({});
    });

    it('should reset regime change reason from prescription', () => {
      ctrl.changeReason = {display : 'MOTIVOS'};
      ctrl.removeAll();
      expect(ctrl.prescription.changeReason).toEqual({});
    });

    it('should reset arv plan interrution reason from prescription', () => {
      ctrl.interruptionReason = {display : 'TOXICIDADE'};
      ctrl.removeAll();
      expect(ctrl.prescription.interruptionReason).toEqual({});
    });

  });

  describe('refill', () => {

    it('should add selected drug to current prescription', () => {
      const item = {drugOrder: {dosingInstructions: 'Empty stomach'}};
      ctrl = $componentController('prescription');
      ctrl.refill({}, item);
      expect(ctrl.prescription.items).toContain({drugOrder: {dosingInstructions: {uuid: 'Empty stomach'}}});
    });

    describe('item from arv prescription', () => {

      it('should set regime to regime of selected drug', () => {

        const item = {drugOrder: {dosingInstructions: 'Empty stomach'}};
        ctrl = $componentController('prescription');

        const prescription = {regime: '(TDF+3TC+EFV', therapeuticLine: 'PRIMEIRA LINHA', arvPlan: 'INICIAR'};
        ctrl.refill(prescription, item);

        expect(ctrl.regime).toEqual(prescription.regime);

      });

      it('should set therapeutic line to therapeutic line of selected drug', () => {

        const item = {drugOrder: {dosingInstructions: 'Empty stomach'}};
        ctrl = $componentController('prescription');

        const prescription = {regime: '(TDF+3TC+EFV', therapeuticLine: 'PRIMEIRA LINHA', arvPlan: 'INICIAR'};
        ctrl.refill(prescription, item);

        expect(ctrl.therapeuticLine).toEqual(prescription.therapeuticLine);

      });

      it('should set isArvPrescriptionItem', () => {

        const item = {drugOrder: {dosingInstructions: 'Empty stomach'}};
        ctrl = $componentController('prescription');

        const prescription = {regime: '(TDF+3TC+EFV', therapeuticLine: 'PRIMEIRA LINHA', arvPlan: 'INICIAR'};
        ctrl.refill(prescription, item);

        expect(ctrl.isArvPrescriptionItem).toEqual(true);

      });
    });

  });

  describe('checkDrugType', () => {

    beforeEach(() => {

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({
        uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
        display: "Local Desconhecido"
      });

      spyOn(drugService, 'isDrugAvailable').and.returnValue($q.resolve(false));

    });

    describe('drug is an ARV', () => {
      beforeEach(() => {

        spyOn(drugService, 'isArvDrug').and.callFake(() => $q(resolve => resolve(true)));

        ctrl = $componentController('prescription', {
          $scope: {}
        });
        ctrl.prescriptionItem = {};
      });

      it('should check a drug as ARV drug', () => {
        const drug = {"uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"};
        ctrl.checkDrugType(drug);
        $rootScope.$apply();
        expect(ctrl.isArvPrescriptionItem).toBe(true);
        expect(ctrl.prescriptionItem.drugOrder).toBe(null);
      });
    });

    describe('drug is not ARV', () => {
      beforeEach(() => {

        spyOn(drugService, 'isArvDrug').and.callFake(() => $q(resolve => resolve(false)));

        ctrl = $componentController('prescription', {
          $scope: {}
        });
        ctrl.prescriptionItem = {};
      });


      it('should check a drug as ARV drug', () => {
        const drug = {"uuid": "9d7127f9-10e8-11e5-9009-0242ac110012"};
        ctrl.checkDrugType(drug);
        $rootScope.$apply();
        expect(ctrl.prescriptionItem.isArv).toBe(false);
      });
    });


  });

  describe('add', () => {

    beforeEach(() => {
      ctrl = $componentController('prescription', {
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
        ctrl = $componentController('prescription');
      });

      const formError = {
        $valid: false,
        $setPristine: () => {
        },
        $setUntouched: () => {
        }
      };

      it('should not add a drug order', () => {
        ctrl.add(formError);
        expect(ctrl.showMessages).toBe(true);
      });
    });

    it('should keep track of arv items added', () => {
      const item = {};
      const form = {
        $valid: true,
        $setPristine: () => {
        },
        $setUntouched: () => {
        },
      };
      ctrl.prescriptionItem = item;
      ctrl.isArvPrescriptionItem = true;
      ctrl.add(form);
      expect(ctrl.prescription.arvItems).toContain(item);
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

      ctrl = $componentController('prescription');

      ctrl.prescriptionConvSet.interruptedReason = interruptedReason;
      ctrl.prescription.items = [1];

      spyOn($uibModal, 'open').and.returnValue({result: $q.resolve({cancellationReason: 'TOXICIDADE'})});

      expect(ctrl.prescription.items.length).toBe(1);

      ctrl.cancelOrStop(item);

      $rootScope.$apply();
      expect(ctrl.prescription.items.length).toBe(0);
      expect(notifier.success).toHaveBeenCalled();
      expect(prescriptionService.stopPrescriptionItem).toHaveBeenCalled();
      expect(prescriptionService.getAllPrescriptions).toHaveBeenCalled();

    });

  });


  describe('save', () => {

    const patient = {uuid: 'ac465c58-68ef-4a19-88ae-c7f72e89a2b2'};
    const regimen = {
      therapeuticLine: {
        uuid: "fdff0637-b36f-4dce-90c7-fe9f1ec586f0"
      },
      drugRegimen: {
        uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b67'
      },
      artPlan: {
        uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b67'
      },
      isArv: true
    };

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
      });

      it('should create a prescription', () => {
        const ctrl = $componentController('prescription', null, {patient});
        ctrl.prescription.regimen = regimen;
        ctrl.save();
        $rootScope.$apply();
        expect(prescriptionService.create).toHaveBeenCalled();
        expect(notifier.success).toHaveBeenCalled();
      });

      describe('retrospective mode', () => {

        it('should open the date and provider modal', () => {

          const retrospectiveMode = true;

          spyOn($uibModal, 'open').and.returnValue({result: $q.resolve()});

          ctrl = $componentController('prescription', null, {retrospectiveMode, patient});

          ctrl.save();

          expect($uibModal.open).toHaveBeenCalled();
        });

        xit('should set prescription selected provider', () => {

          const date = new Date();
          const provider = {display: '290-7 - Joana Albino'};
          const retrospectiveMode = true;

          spyOn($uibModal, 'open').and.returnValue({result: $q.resolve({date, provider})});

          ctrl = $componentController('prescription', null, {retrospectiveMode, patient});

          ctrl.save();

          $rootScope.$apply();

          expect(ctrl.selectedProvider).toEqual(provider);

        }, 'Selected provider is set but then it is removed after save');

        it('should set prescription date', () => {

          const date = new Date();
          const provider = {display: '290-7 - Joana Albino'};
          const retrospectiveMode = true;

          spyOn($uibModal, 'open').and.returnValue({result: $q.resolve({date, provider})});

          ctrl = $componentController('prescription', null, {retrospectiveMode, patient});

          ctrl.prescription.regimen = regimen;

          ctrl.save();

          $rootScope.$apply();

          expect(ctrl.prescriptionDate).toEqual(date);

        });

      });
    });

    describe('create prescription failed', () => {
      beforeEach(() => {

        spyOn(prescriptionService, 'create').and.callFake(() => $q((resolve, reject) => reject({data: {error: {message: '[]'}}})));

        ctrl = $componentController('prescription',null, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});

        ctrl.prescription.items.push({
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
        ctrl.prescriptionDate = new Date();
        ctrl.selectedProvider = {uuid: '123'};
        ctrl.showNewPrescriptionsControlls = null;
      });

      it('should not create a prescription', () => {
        ctrl.prescription.regimen = regimen;
        ctrl.save();
        $rootScope.$apply();
        expect(notifier.error).toHaveBeenCalled();
      });
    });

    describe('invalid prescription', () => {

      beforeEach(() => {
        ctrl = $componentController('prescription',null, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});
        ctrl.prescription.items.push({
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
        ctrl.save();
      });
    });

    describe('another active ARV prescription exists', () => {

      beforeEach(() => {
        ctrl = $componentController('prescription', {notifier}, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});

        ctrl.prescription.items.push({
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

        ctrl.existingPrescriptions.push({
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
        ctrl.prescription.regimen = regimen;
        ctrl.save();
        $rootScope.$apply();
        expect(notifier.error).toHaveBeenCalled();
      });
    });

    describe('at least one item in the new prescription exists in another active prescription', () => {
      beforeEach(() => {

        ctrl = $componentController('prescription', {notifier}, {patient: {uuid: '9d674660-10e8-11e5-9009-0242ac110011'}});
        ctrl.prescription.items.push({
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
        ctrl.existingPrescriptions.push({
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
        ctrl.prescription.regimen = regimen;
        ctrl.save();
        $rootScope.$apply();
        expect(notifier.error).toHaveBeenCalled();
      });
    });

  });

  describe('onIsArvPrescriptionItemChange', () => {

    beforeEach(() => {
      ctrl = $componentController('prescription');

      ctrl.prescriptionItem = {
        "isArv": false,
        "drugOrder": {"drug": {}},
        "therapeuticLine": {},
        "currentArvLine": {},
        "currentRegimen": {},
        "regime": {},
        "arvPlan": {}
      };

    });

    describe('arv regimen', () => {

      it('should load patient regimen', () => {

        ctrl.isArvPrescriptionItem = true;

        ctrl.onIsArvPrescriptionItemChange();

        expect(prescriptionService.getPatientRegimen).toHaveBeenCalled();

      });

    });

    it('should clean drug fields', () => {

      ctrl.isArvPrescriptionItem = false;

      ctrl.onIsArvPrescriptionItemChange();

      expect(ctrl.prescriptionItem.drugOrder.drug).toBe(null);
    });

  });

  describe('checkItemIsRefillable', () => {
    const prescription = {prescriptionStatus: "EXPIRED", regime: {uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b66'}};

    describe('arv regimen', () => {

      it('should return false if prescription has different drugRegimen than existing prescription', () => {
        const item = {drugOrder: {drug: {uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b69'}}};
        const newItem = {drugOrder: {drug: {uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b68'}}};
        const controller = $componentController('prescription');
        controller.prescription.regime = {uuid: '3c6e46ec-b302-4769-b2e2-0bc55ef72b67'};
        controller.prescription.items = [item];
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
      controller.prescription.items = [prescriptionItem];
      expect(controller.checkItemIsRefillable(prescription, prescriptionItem)).toBe(false);
    });
  });

  describe('checkActiveAndNewItemStatus', () => {
    const item = {status: "NEW"};
    it('should return True for NEW Item status', () => {
      expect(ctrl.checkActiveAndNewItemStatus(item)).toBe(true);
    });
  });

  describe('isRegimenEditable', () => {

    it('should return true if prescription has no items', () => {

      const ctrl = $componentController('prescription');

      expect(ctrl.isRegimenEditable()).toBe(true);

    });

    it('should return true if prescription has no regimen defined', () => {

      const ctrl = $componentController('prescription');

      ctrl.prescription.items = [1];

      expect(ctrl.isRegimenEditable()).toBe(true);

    });

    it('should return false if prescription has an item and a regimen defined', () => {
      // Prescription has an arv item
      const ctrl = $componentController('prescription');

      ctrl.prescription.items = [1];

      ctrl.prescription.regime = {};

      expect(ctrl.isRegimenEditable()).toBe(false);

    });

  });

});
