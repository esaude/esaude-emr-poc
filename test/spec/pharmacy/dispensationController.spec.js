'use strict';

describe('DispensationController', function () {

  var $controller, controller, dispensationService, prescriptionService, localStorageService;

  var rootScope = {'patient': {'uuid': '0810aecc-6642-4c1c-ac1e-537a0cfed81'}};

  var prescriptions = [
    {
      disable: false,
      prescriptionItems: [
        {regime: {uuid: '1'}, drugToPickUp: 6},
        {regime: {uuid: '1'}, drugToPickUp: 2}
      ]
    },
    {
      disable: false,
      prescriptionItems: [
        {drugToPickUp: 7}
      ]
    }
  ];

  beforeEach(module('pharmacy'));

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  beforeEach(function () {
    dispensationService = jasmine.createSpyObj('dispensationService', ['create']);
    dispensationService.create.and.returnValue({
      then: function (fn) {
        fn();
      }
    });

    prescriptionService = jasmine.createSpyObj('prescriptionService', ['getPatientNonDispensedPrescriptions']);
    prescriptionService.getPatientNonDispensedPrescriptions.and.returnValue({
      then: function (fn) {
        fn(prescriptions);
      }
    });

    localStorageService = {
      cookie: {
        get: jasmine.createSpy(function () {
          return {uuid: 'uuid'};
        })
      }
    }
  });

  beforeEach(function () {
    controller = $controller('DispensationController', {
      $scope: {},
      $rootScope: rootScope,
      $filter: {},
      dispensationService: dispensationService,
      prescriptionService: prescriptionService,
      localStorageService: localStorageService
    });
  });

  describe('activate', function () {

    it('should load patient prescriptions', function () {
      expect(controller.prescriptions.length).toBe(2);
      expect(controller.prescriptions).toEqual(prescriptions);
      expect(controller.selectedPrescriptionItems.length).toBe(0);
    });

  });

  describe('select', function () {

    var prescription = prescriptions[1];
    var item = prescription.prescriptionItems[0];

    it('should select item do dispense', function () {

      controller.select(prescription, item);

      expect(controller.selectedPrescriptionItems).toContain(item);
    });

    it('should mark item as selected', function () {

      controller.select(prescription, item);

      expect(controller.selectedPrescriptionItems[0]).toEqual({selected: true, drugToPickUp: 7, prescription: prescription});
    });

    it('should set reference to prescription on item', function () {

      expect(item.prescription).toBeUndefined();

      controller.select(prescription, item);

      expect(item.prescription).toEqual(prescription);
    });

    afterEach(function () {
      item.selected = false;
      item.prescription = undefined;
    });

    describe('ARV prescription item', function () {

      it('should select all items from the same regime', function () {

        var prescription = prescriptions[0];
        var item = prescription.prescriptionItems[1];

        controller.select(prescription, item);

        expect(controller.selectedPrescriptionItems).toContain(prescription.prescriptionItems[0]);
        expect(controller.selectedPrescriptionItems).toContain(prescription.prescriptionItems[1]);
      });

    });

  });

  xdescribe('remove', function () {

  });

  describe('updatePickup', function () {

    describe('ARV prescription item', function () {

      var prescriptionItems = [
        {regime: {uuid: '1'}, drugToPickUp: 6},
        {regime: {uuid: '1'}, drugToPickUp: 2},
        {regime: {uuid: '1'}, drugToPickUp: 3}
      ];

      it('should set the maximum quantity to dispense to the prescription item with the least available items to pickup', function () {

        var item = prescriptionItems[0];

        controller.selectedPrescriptionItems = prescriptionItems;
        item.quantity = 3;
        controller.updatePickup(item);

        expect(item.quantity).toEqual(prescriptionItems[1].drugToPickUp);

      });

      it('should dispense all items in the same quantity', function () {

        var item = prescriptionItems[0];

        controller.selectedPrescriptionItems = prescriptionItems;
        item.quantity = 3;
        controller.updatePickup(item);

        prescriptionItems.forEach(function (i) {
          expect(i.quantity).toEqual(prescriptionItems[1].drugToPickUp);
        });

      });

    });

  });


  xdescribe('dispense', function () {

  });


});
