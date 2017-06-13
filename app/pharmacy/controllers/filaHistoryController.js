(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('FilaHistoryController', FilaHistoryController);

  FilaHistoryController.$inject = ['$stateParams', 'encounterService', 'patientService', 'reportService', 'prescriptionService', '$q'];

  function FilaHistoryController($stateParams, encounterService, patientService, reportService, prescriptionService, $q) {
    var patientUuid = $stateParams.patientUuid;
    var pickups = [];
    var now = new Date();

    var vm = this;
    vm.displayedPickups = [];
    vm.filteredPickups = [];
    vm.year = now.getFullYear();
    vm.years = [vm.year];
    vm.onDateChange = onDateChange;
    vm.onPrint = onPrint;

    activate();

    ////////////////

    function activate() {
      encounterService.getPatientPharmacyEncounters(patientUuid).then(function (encounters) {
        var groupByYear = _.curryRight(_.groupBy)(function (pickup) {
          return pickup.encounterDatetime.getFullYear();
        });
        vm.year = _.head(encounters).encounterDatetime.getFullYear();
        vm.years = _.flow([groupByYear, _.keys, _.reverse])(encounters);
        pickups = encounters;
        vm.displayedPickups = encounters;
        vm.filteredPickups = encounters;
      });
    }

    /**
     * Filters the prescription by date range.
     */
    function onDateChange() {
      // Considering that pickups always sorted by most recent
      var start = _.findIndex(pickups, function (p) {
        return p.encounterDatetime.getFullYear() <= vm.year;
      });
      if (start < 0)
        vm.filteredPickups = [];
      else
        vm.filteredPickups = _.slice(pickups, start);
    }

    function onPrint() {
      var getPatient = patientService.getPatient(patientUuid);
      var getPrescriptions = prescriptionService.getPatientPrescriptions(patientUuid);

      $q.all([getPatient, getPrescriptions]).then(function (values) {
        var patient = values[0];
        patient.pickups = vm.filteredPickups;
        patient.prescriptions = _.filter(values[1], function (p) {
          return p.prescriptionDate.getFullYear() === vm.year;
        });
        reportService.printPatientARVPickupHistory(patient);
      });
    }

  }

})();
