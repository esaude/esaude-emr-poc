(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('FilaHistoryController', FilaHistoryController);

  FilaHistoryController.$inject = ['$stateParams', 'encounterService', 'patientService'];

  function FilaHistoryController($stateParams, encounterService, patientService) {
    var patientUUID = $stateParams.patientUuid;
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
      encounterService.getPatientFilaEncounters(patientUUID).then(function (encounters) {

        if (encounters.length === 0)
          return;

        var groupByYear = _.curryRight(_.groupBy)(function (pickup) {
          return pickup.encounterDatetime.getFullYear();
        });
        vm.year = _.head(encounters).encounterDatetime.getFullYear();
        vm.years = _.flow([groupByYear, _.keys, _.reverse])(encounters);
        pickups = encounters;
        vm.displayedPickups = encounters;
        vm.filteredPickups = encounters;
        onDateChange();
      });
    }

    /**
     * Filters the prescription by date range.
     */
    function onDateChange() {
      vm.filteredPickups = _.filter(pickups, function (p) {
        return p.encounterDatetime.getFullYear() === vm.year;
      });
    }

    function onPrint() {
      patientService.printPatientARVPickupHistory(vm.year, patientUUID, vm.filteredPickups);
    }

  }

})();
