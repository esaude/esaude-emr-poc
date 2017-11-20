'use strict';

describe('DispensationController', function () {

  var $controller, $q, $rootScope, controller, dispensationService, localStorageService, notifier, prescriptionService,
    sessionService, spinner;

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

  beforeEach(module('pharmacy', function ($provide, $translateProvider) {
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

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _dispensationService_, _localStorageService_, _notifier_,
                              _prescriptionService_, _sessionService_, _spinner_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
    spinner = _spinner_;
    dispensationService = _dispensationService_;
    prescriptionService = _prescriptionService_;
    notifier = _notifier_;
    localStorageService = _localStorageService_;
  }));

  describe('activate', function () {

    beforeEach(function () {

      spyOn(sessionService, 'getCurrentUser').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      spyOn(prescriptionService, 'getPatientNonDispensedPrescriptions').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(prescriptions);
        });
      });

      controller = $controller('DispensationController', {
        $filter: {},
        prescriptionService: prescriptionService,
        sessionService: sessionService,
        spinner: spinner
      });
    });

    it('should load patient prescriptions', function () {
      $rootScope.$apply();
      expect(controller.prescriptions.length).toBe(3);
      expect(controller.prescriptions).toEqual(prescriptions);
      expect(controller.selectedPrescriptionItems.length).toBe(0);
    });

  });

  describe('select', function () {

    beforeEach(function () {
      controller = $controller('DispensationController');
    });

    var prescription = prescriptions[1];
    var item = prescription.prescriptionItems[0];

    it('should select item do dispense', function () {

      controller.select(prescription, item);

      expect(controller.selectedPrescriptionItems).toContain(item);
    });

    it('should mark item as selected', function () {

      controller.select(prescription, item);

      expect(controller.selectedPrescriptionItems[0]).toEqual({
        selected: true,
        drugToPickUp: 7,
        prescription: prescription
      });
    });

    it('should set reference to prescription on item', function () {

      expect(item.prescription).toBeUndefined();

      controller.select(prescription, item);

      expect(item.prescription).toEqual(prescription);
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

    afterEach(function () {
      item.selected = false;
      item.prescription = undefined;
    });

  });

  describe('toggleVisibility', function () {

    var selectedPrescription = prescriptions[0];

    beforeEach(function () {
      controller = $controller('DispensationController');
      controller.prescriptions = prescriptions;
    });

    it('it should show the selected prescription and hide all other', function () {

      selectedPrescription.hidden = true;
      prescriptions[1].hidden = true;
      prescriptions[2].hidden = false;

      controller.toggleVisibility(selectedPrescription);

      expect(prescriptions[0].hidden).toBe(false);
      expect(prescriptions[1].hidden).toBe(true);
      expect(prescriptions[2].hidden).toBe(true);
    });

  });

  xdescribe('remove', function () {

  });

  describe('updatePickup', function () {

    var prescriptionItems = [
      {regime: {uuid: '1'}, drugToPickUp: 6},
      {regime: {uuid: '1'}, drugToPickUp: 2},
      {regime: {uuid: '1'}, drugToPickUp: 3}
    ];

    beforeEach(function () {
      controller = $controller('DispensationController');
    });

    describe('ARV prescription item', function () {

      it('should set the maximum quantity to dispense to the prescription item with the least available items to pickup', function () {

        var item = prescriptionItems[0];

        controller.selectedPrescriptionItems = prescriptionItems;
        item.quantity = 4;
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

    it('should show warning when dispensing more than permitted', function () {

      spyOn(notifier, 'info').and.callThrough();

      var item = prescriptionItems[0];

      controller.selectedPrescriptionItems = prescriptionItems;
      item.quantity = 4;
      controller.updatePickup(item);

      expect(notifier.info).toHaveBeenCalled();
    });

  });


  describe('dispense', function () {

    beforeEach(function () {
      spyOn(sessionService, 'getCurrentUser').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({person: {uuid: 'uuid'}});
        })
      });

      spyOn(dispensationService, 'createDispensation').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      spyOn(prescriptionService, 'getPatientNonDispensedPrescriptions').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        });
      });

      spyOn(notifier, 'success').and.callThrough();


      localStorageService = {
        cookie: {
          get: function () {
            return { uuid: 'xpto'};
          }
        }
      };

      controller = $controller('DispensationController', {
        localStorageService: localStorageService
      });
    });

    it('should call dispensationService', function () {

      $rootScope.$apply();

      controller.dispense();

      expect(dispensationService.createDispensation).toHaveBeenCalled();

    });

    xit('should empty selected prescription items list', function () {

    });

    it('should notify the user about the dispensation', function () {

      $rootScope.$apply();

      controller.dispense();

      $rootScope.$apply();

      expect(notifier.success).toHaveBeenCalled();

    });

  });


});
