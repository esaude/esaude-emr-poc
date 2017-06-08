describe('FilaHistoryController', function () {

  var $controller, controller, encounterService;

  var stateParams = {'patientUuid': '0810aecc-6642-4c1c-ac1e-537a0cfed81'};

  var encounters = [
    {"encounterDatetime": new Date("2016-08-28")},
    {"encounterDatetime": new Date("2016-07-05")},
    {"encounterDatetime": new Date("2016-06-04")},
    {"encounterDatetime": new Date("2016-05-02")}
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
      expect(controller.endDateOpen).toBe(false);
      expect(controller.endDate).toBe(encounters[0].encounterDatetime);
      expect(controller.startDateOpen).toBe(false);
      expect(controller.startDate).toBe(encounters[3].encounterDatetime);
    })
  });

  describe('onDateChange', function () {

    it('should filter pickups by date range', function () {
      expect(controller.filteredPickups).toBe(encounters);

      controller.startDate = new Date('2016-06-03');
      controller.endDate = new Date('2016-08-27');
      controller.onDateChange();

      expect(controller.filteredPickups.length).toBe(2);
      expect(controller.filteredPickups[0]).toBe(encounters[1]);
      expect(controller.filteredPickups[1]).toBe(encounters[2]);
    });

    it('should set pickups to empty when end date is too low', function () {
      expect(controller.filteredPickups).toBe(encounters);

      controller.startDate = new Date('2016-06-03');
      controller.endDate = new Date('2016-05-01');
      controller.onDateChange();

      expect(controller.filteredPickups.length).toBe(0);
    });

    it('should set pickups to empty when start date is too high', function () {
      expect(controller.filteredPickups).toBe(encounters);

      controller.startDate = new Date('2016-08-29');
      controller.endDate = new Date('2016-08-27');
      controller.onDateChange();

      expect(controller.filteredPickups.length).toBe(0);
    });
  });

  it('should open start date datepicker', function () {
    expect(controller.startDateOpen).toBe(false);
    controller.openStartDatepicker();
    expect(controller.startDateOpen).toBe(true);
  });

  it('should open end date datepicker', function () {
    expect(controller.endDateOpen).toBe(false);
    controller.openEndDatepicker();
    expect(controller.endDateOpen).toBe(true);
  });
});
