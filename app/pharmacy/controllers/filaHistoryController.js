(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('FilaHistoryController', FilaHistoryController);

  FilaHistoryController.$inject = ['$stateParams', 'encounterService'];

  function FilaHistoryController($stateParams, encounterService) {
    var pickups = [];

    var vm = this;

    vm.displayedPickups = [];
    vm.endDate = new Date();
    vm.endDateOpen = false;
    vm.filteredPickups = [];
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
        vm.startDate = _.last(encounters).encounterDatetime;
        vm.endDate = _.head(encounters).encounterDatetime;
        pickups = encounters;
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
      // Considering that pickups always sorted by most recent
      var start = _.findIndex(pickups, function (p) {
        return p.encounterDatetime <= vm.endDate;
      });
      var end = _.findLastIndex(pickups, function (p) {
        return p.encounterDatetime >= vm.startDate;
      });
      if (start < 0 || end < 0)
        vm.filteredPickups = [];
      else
        vm.filteredPickups = _.slice(pickups, start, end + 1);
    }
  }

})();
