(function () {
  'use strict';

  angular
    .module('pharmacy')
    .component('filaHistory', {
      bindings: {
        patient: '<'
      },
      controller: FilaHistoryController,
      controllerAs: 'vm',
      templateUrl: '../pharmacy/components/filaHistory.html'
    });

  /* @ngInject */
  function FilaHistoryController(encounterService, patientService, dispensationService, $q, notifier, $filter) {

    var DAYS_IN_YEAR = 366;

    var pickups = [];
    var now = new Date();

    var vm = this;
    vm.displayedPickups = [];
    vm.filteredPickups = [];
    vm.groupedDispensations = [];
    vm.year = now.getFullYear();
    vm.endDate = moment().startOf('day').toDate();
    vm.startDate = moment().add(-1, 'year').startOf('day').toDate();
    vm.years = [vm.year];

    vm.$onInit = $onInit;
    vm.updateResults = updateResults;
    vm.onPrint = onPrint;
    vm.onStartDateChange = onStartDateChange;

    function $onInit() {
      updateResults();
    }

    function onStartDateChange() {
      if (vm.startDate) {
        vm.endDate = moment(vm.startDate).add(1, 'year').toDate();
      }
    }

    function onPrint() {
      var daysBetween = moment(vm.endDate).diff(moment(vm.startDate), 'days');
      if (daysBetween <= DAYS_IN_YEAR) {
        patientService.printPatientARVPickupHistory(vm.patient.uuid, vm.groupedDispensations, vm.startDate, vm.endDate);
      } else {
        notifier.error($filter('translate')('FILA_REPORT_INVALID_DATE_INTERVAL'));
      }
    }

    function updateResults() {
      var getDispensation = dispensationService.getDispensation(vm.patient.uuid,
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
