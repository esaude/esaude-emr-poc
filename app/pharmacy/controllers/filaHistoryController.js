(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('FilaHistoryController', FilaHistoryController);

  FilaHistoryController.$inject = ['$stateParams', 'encounterService', 'patientService', 'dispensationService', '$q'];

  function FilaHistoryController($stateParams, encounterService, patientService, dispensationService, $q) {
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
    vm.onStartDateChange = onStartDateChange;

    vm.endDate = moment().startOf('day').toDate();
    vm.startDate = moment().add(-1, 'year').startOf('day').toDate();

    activate();

    ////////////////

    function activate() {

      var getDispensation = dispensationService.getDispensation(patientUUID, '01-01-2017', '10-09-2017');
      $q.all([getDispensation]).then(function (values) {
        var groupedDispensations = values[0];
        var dispensations = [];
        groupedDispensations.forEach(function (groupedDispensation) {
          groupedDispensation.dispensationItems.forEach(function (dispensationItem) {
            dispensations.push(dispensationItem)
          });
        });
        vm.displayedPickups = dispensations;
        vm.filteredPickups = dispensations;
      });

      /*encounterService.getPatientFilaEncounters(patientUUID).then(function (encounters) {

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
      });*/
    }

    /**
     * Filters the prescription by date range.
     */
    function onDateChange() {
      vm.filteredPickups = _.filter(pickups, function (p) {
        return p.encounterDatetime.getFullYear() === vm.year;
      });
    }

    function onStartDateChange() {
      if (vm.startDate) {
        //vm.endDate = moment(vm.startDate).add(1, 'year').toDate();
      }
    }

    function onPrint() {
      patientService.printPatientARVPickupHistory(vm.year, patientUUID, vm.filteredPickups);
    }

  }

})();
