(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('scheduleList', {
      controller: ScheduleListController,
      controllerAs: 'vm',
      bindings: {
        onPatientSelect: '&',
        scheduleType: '<'
      },
      templateUrl: '../common/patient/components/scheduleList.html'
    });

  /* @ngInject */
  function ScheduleListController(scheduleService, translateFilter) {

    var SCHEDULE_TYPE_CURRENT_PROVIDER = 'currentProvider';
    var SCHEDULE_TYPE_DRUG_PICKUP = 'drugPickup';

    var vm = this;

    vm.patients = [];
    vm.title = translateFilter('SCHEDULE_LIST_PATIENT');

    activate();

    ////////////////

    function activate() {
      var getSchedule;

      if (vm.scheduleType === SCHEDULE_TYPE_CURRENT_PROVIDER) {
        getSchedule = scheduleService.getCurrentProviderSchedule();
        vm.title = translateFilter('SCHEDULE_LIST_PROVIDER');
      } else if (vm.scheduleType === SCHEDULE_TYPE_DRUG_PICKUP) {
        getSchedule = scheduleService.getDrugPickupSchedule();
        vm.title = translateFilter('SCHEDULE_LIST_DRUG_PICKUP');
      } else {
        getSchedule = scheduleService.getPatientSchedule();
      }

      getSchedule.then(function (patients) {
        vm.patients = patients;
      });
    }
  }

})();
