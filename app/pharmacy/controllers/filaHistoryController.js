(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('FilaHistoryController', FilaHistoryController);

  FilaHistoryController.$inject = ['$stateParams', 'encounterService'];

  function FilaHistoryController($stateParams, encounterService) {
    var vm = this;
    vm.displayedPickups = [];
    vm.endDate = new Date();
    vm.endDateOpen = false;
    vm.filteredPickups = [];
    vm.pickups = [];
    vm.startDate = new Date();
    vm.startDateOpen = false;
    vm.onDateChange = onDateChange;
    vm.openStartDatepicker = openStartDatepicker;
    vm.openEndDatepicker = openEndDatepicker;

    activate();

    ////////////////

    function activate() {
      var patientUuid = $stateParams.patientUuid;
      encounterService.getPatientPharmacyEncounters(patientUuid).then(function (encounters) {
        vm.startDate = new Date(_.last(encounters).encounterDatetime);
        vm.endDate = new Date(_.head(encounters).encounterDatetime);
        vm.pickups = encounters;
        vm.displayedPickups = encounters;
        vm.filteredPickups = encounters;
      });
    }

    function openStartDatepicker() {
      vm.startDateOpen = true;
    }

    function openEndDatepicker() {
      vm.endDateOpen = true;
    }

    /**
     * Filters the prescription by date range.
     */
    function onDateChange() {
      // Considering that vm.pickups always sorted by most recent
      var start = _.findIndex(vm.pickups, function (p) {
        return p.encounterDatetime <= vm.endDate;
      });
      var end = _.findLastIndex(vm.pickups, function (p) {
        return p.encounterDatetime >= vm.startDate;
      });
      if (start < 0) start = 0;
      if (end < 0) end = vm.pickups.length;
      vm.filteredPickups = _.slice(vm.pickups, start, end + 1);
    }
  }

})();
