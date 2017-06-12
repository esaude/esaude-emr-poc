describe('FilaHistoryController', function () {

  var $controller, controller, encounterService;

  var stateParams = {'patientUuid': '0810aecc-6642-4c1c-ac1e-537a0cfed81'};

  var encounters = [
    {"encounterDatetime": new Date("2018-08-28")},
    {"encounterDatetime": new Date("2017-07-05")},
    {"encounterDatetime": new Date("2016-06-04")},
    {"encounterDatetime": new Date("2015-05-02")}
  ];

  beforeEach(module('pharmacy'));

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  beforeEach(function () {
    encounterService = jasmine.createSpyObj('encounterService', ['getPatientPharmacyEncounters']);
    encounterService.getPatientPharmacyEncounters.and.returnValue({
      then: function (fn) {
        fn(encounters);
      }
    });
  });

  beforeEach(function () {
    controller = $controller('FilaHistoryController', {
      $statePrams: stateParams,
      encounterService: encounterService
    });
  });

  describe('activate', function () {

    it('should load patient pharmacy encounters', function () {
      expect(controller.displayedPickups).toBe(encounters);
      expect(controller.filteredPickups).toBe(encounters);
      expect(controller.year).toBe(encounters[0].encounterDatetime.getFullYear());
    })
  });

  describe('onDateChange', function () {

    it('should filter pickups by date range', function () {
      expect(controller.filteredPickups).toBe(encounters);

      controller.year = 2016;
      controller.onDateChange();

      expect(controller.filteredPickups.length).toBe(2);
      expect(controller.filteredPickups[0]).toBe(encounters[2]);
      expect(controller.filteredPickups[1]).toBe(encounters[3]);
    });

    it('should set pickups to empty when year is too low', function () {
      expect(controller.filteredPickups).toBe(encounters);

      controller.year = 2014;
      controller.onDateChange();

      expect(controller.filteredPickups.length).toBe(0);
    });
  });
});
