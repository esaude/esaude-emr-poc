'use strict';

describe('dispensation', () => {

  var $componentController, $q, $rootScope, controller, dispensationService, localStorageService, notifier, prescriptionService,
    sessionService, patientService;

  var rootScope = {'patient': {'uuid': '0810aecc-6642-4c1c-ac1e-537a0cfed81'}};

  var prescriptions = [
    {
      hidden: false,
      prescriptionItems: [
        {regime: {uuid: '1'}, drugToPickUp: 6},
        {regime: {uuid: '1'}, drugToPickUp: 2}
      ]
    },
    {
      hidden: false,
      prescriptionItems: [
        {drugToPickUp: 7}
      ]
    },
    {
      hidden: false,
      prescriptionItems: [
        {drugToPickUp: 9}
      ]
    }
  ];

  beforeEach(module('pharmacy', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock initialization
    $provide.factory('initialization', () => {
    });
    // Mock appService
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: fn => {
      }
    });
    $provide.value('appService', appService);
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _dispensationService_, _localStorageService_, _notifier_,
                     _prescriptionService_, _sessionService_, _patientService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
    dispensationService = _dispensationService_;
    prescriptionService = _prescriptionService_;
    notifier = _notifier_;
    patientService = _patientService_;
  }));

  describe('$onInit', () => {

    beforeEach(() => {

      spyOn(sessionService, 'getCurrentUser').and.callFake(() => $q(resolve => {
        resolve({});
      }));

      spyOn(prescriptionService, 'getPatientNonDispensedPrescriptions').and.callFake(() => $q(resolve => {
        resolve(prescriptions);
      }));

      spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => {
        resolve({});
      }));

      controller = $componentController('dispensation', null, {patient: {uuid: 'uuid'}});
    });

    it('should load patient prescriptions', () => {

      controller.$onInit();

      $rootScope.$apply();
      expect(controller.prescriptions.length).toBe(3);
      expect(controller.prescriptions).toEqual(prescriptions);
      expect(controller.selectedPrescriptionItems.length).toBe(0);
    });

  });

  describe('select', () => {

    beforeEach(() => {
      controller = $componentController('dispensation');
    });

    var prescription = prescriptions[1];
    var item = prescription.prescriptionItems[0];

    it('should select item do dispense', () => {

      controller.select(prescription, item);

      expect(controller.selectedPrescriptionItems).toContain(item);
    });

    it('should mark item as selected', () => {

      controller.select(prescription, item);

      expect(controller.selectedPrescriptionItems[0].selected).toEqual(true);
    });

    it('should mark item as selected when already selected', () => {
      controller.select(prescription, item);
      expect(controller.selectedPrescriptionItems[0].selected).toEqual(true);
      controller.select(prescription, item);
      expect(controller.selectedPrescriptionItems[0].selected).toEqual(true);
    });

    it('should set reference to prescription on item', () => {

      expect(item.prescription).toBeUndefined();

      controller.select(prescription, item);

      expect(item.prescription).toEqual(prescription);
    });


    it('should select a item that is already dispensed', () => {

      spyOn(notifier, 'error').and.callThrough();

      var itemDispensed =  {regime: {uuid: '1'}, drugToPickUp: 10, drugPickedUp:15, quantity:8};
      controller.select(prescription, itemDispensed);

      expect(notifier.error).toHaveBeenCalled();
    });
    
    it('should select arv item with quantity to pickup > 30 (45) and sets as default quantiy 30 pills', () => {

      var arvItem =  {drugToPickUp: 45, arv: true};
      controller.select(prescription, arvItem);

      expect(arvItem.quantity).toEqual(30);
    });

    it('should select non arv item with quantity to pickup > 30 (38) and sets as default quantity the total number of pills to pickup', () => {

      var nonArvItem =  {drugToPickUp: 38, arv: false};
      controller.select(prescription, nonArvItem);

      expect(nonArvItem.quantity).toEqual(38);
    });

    afterEach(() => {
      item.selected = false;
      item.prescription = undefined;
    });

  });

  describe('toggleVisibility', () => {

    var selectedPrescription = prescriptions[0];

    beforeEach(() => {
      controller = $componentController('dispensation');
      controller.prescriptions = prescriptions;
    });

    it('it should show the selected prescription and hide all other', () => {

      selectedPrescription.hidden = true;
      prescriptions[1].hidden = true;
      prescriptions[2].hidden = false;

      controller.toggleVisibility(selectedPrescription);

      expect(prescriptions[0].hidden).toBe(false);
      expect(prescriptions[1].hidden).toBe(true);
      expect(prescriptions[2].hidden).toBe(true);
    });

  });

  describe('remove', () => {

    beforeEach(() => {
      controller = $componentController('dispensation');
      controller.selectedPrescriptionItems = [];
    });
      it('it should remove a selected item', () => {
        var item = {"selected": true,
          "regime" : "AZT+3TC+XYV"};

        controller.selectedPrescriptionItems.push(item);
        controller.remove(item);
        expect(controller.selectedPrescriptionItems.length).toBe(0);
      });


    it('it should not remove a not selected item', () => {
      var item = {};
      controller.remove(item);
    });

    });

  describe('updatePickup', () => {

    var prescriptionItems = [
      {regime: {uuid: '1'}, drugToPickUp: 6}
        ];

    beforeEach(() => {
      controller = $componentController('dispensation');
    });

    describe('ARV prescription item', () => {

      it('should set the maximum quantity to dispense to the prescription item with the least available items to pickup', () => {

        var item = prescriptionItems[0];

        controller.selectedPrescriptionItems = prescriptionItems;
        item.quantity = 4;
        item.status = "NEW";
        controller.updatePickup(item);

        expect(item.quantity).toEqual(prescriptionItems[0].quantity);

      });

    });

    it('should show warning when dispensing more than permitted', () => {

      spyOn(notifier, 'info').and.callThrough();

      var item = prescriptionItems[0];

      controller.selectedPrescriptionItems = prescriptionItems;
      item.quantity = 8;
      controller.updatePickup(item);

      expect(notifier.info).toHaveBeenCalled();
    });

  });


  xdescribe('dispense', () => {

  });


});
