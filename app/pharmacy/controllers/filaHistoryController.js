(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('FilaHistoryController', FilaHistoryController);

  FilaHistoryController.$inject = ['$stateParams', 'encounterService', 'patientService', 'dispensationService', '$q', 'notifier', '$filter'];

  function FilaHistoryController($stateParams, encounterService, patientService, dispensationService, $q, notifier, $filter) {

    var DAYS_IN_YEAR = 366;

    var patientUUID = $stateParams.patientUuid;
    var pickups = [];
    var now = new Date();

    var vm = this;
    vm.displayedPickups = [];
    vm.filteredPickups = [];
    vm.groupedDispensations = [];
    vm.year = now.getFullYear();
    vm.years = [vm.year];
    vm.onPrint = onPrint;
    vm.onStartDateChange = onStartDateChange;
    vm.updateResults = updateResults;

    vm.endDate = moment().startOf('day').toDate();
    vm.startDate = moment().add(-1, 'year').startOf('day').toDate();

    updateResults();

    ////////////////

    function onStartDateChange() {
      if (vm.startDate) {
        vm.endDate = moment(vm.startDate).add(1, 'year').toDate();
      }
    }

    function onPrint() {
      var daysBetween = moment(vm.endDate).diff(moment(vm.startDate), 'days');
      if (daysBetween <= DAYS_IN_YEAR) { 
        patientService.printPatientARVPickupHistory(patientUUID, vm.groupedDispensations, vm.startDate, vm.endDate);
      } else {
        notifier.error($filter('translate')('FILA_REPORT_INVALID_DATE_INTERVAL'));        
      }
    }

    function updateResults() {
      var getDispensation = dispensationService.getDispensation(patientUUID,
        moment(vm.startDate).format('DD-MM-YYYY'),
        moment(vm.endDate).format('DD-MM-YYYY'));
      $q.all([getDispensation]).then(function (values) {
        vm.groupedDispensations = values[0];
        var dispensations = [];
        vm.groupedDispensations.forEach(function (groupedDispensation) {
          groupedDispensation.dispensationItems.forEach(function (dispensationItem) {
            dispensations.push(dispensationItem)
          });
        });
        vm.displayedPickups = dispensations;
        vm.filteredPickups = dispensations;
      });
    }

  }

})();
