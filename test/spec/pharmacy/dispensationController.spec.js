'use strict';

describe('DispensationController', function () {

  var $controller, controller, dispensationService, prescriptionService, localStorageService;

  var rootScope = {'patient': { 'uuid': '0810aecc-6642-4c1c-ac1e-537a0cfed81' }};

  var prescriptions = [
    {disable: false},
    {disable: false},
    {disable: false}
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

    it('should update dispense list message', function () {
      expect(controller.dispenseListNoResultsMessage).toBe('PHARMACY_LIST_NO_ITEMS');
    });

  });

  describe('initPrescriptions', function () {

    it('should load patient prescriptions', function () {
      expect(controller.prescriptions.length).toBe(0);

      controller.initPrescriptions();

      expect(controller.prescriptions).toBe(prescriptions);
      expect(controller.prescription).toBe(prescriptions[0]);
      expect(controller.prescriptiontNoResultsMessage).toBeNull();
      expect(controller.selectedItems.length).toBe(0);
    });

  });

  describe('select', function () {

    var selection = 1;

    afterEach(function () {
      prescriptions[selection].disable = false;
    });

    it('should select drug do dispense', function () {

      controller.select(prescriptions[1]);

      expect(controller.selectedItems).toContain(prescriptions[1]);
    });

    it('should disable selection of selected drug', function () {

      controller.select(prescriptions[selection]);

      expect(controller.selectedItems[0]).toEqual({disable: true});
    });

    it('should update dispense list message', function () {

      controller.select(prescriptions[selection]);

      expect(controller.dispenseListNoResultsMessage).toBeNull();
    });

  });

  xdescribe('remove', function () {

  });

  xdescribe('updatePickUp', function () {

  });


  xdescribe('dispense', function () {

  });


});
