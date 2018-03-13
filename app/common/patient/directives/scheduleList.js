(function () {
  'use strict';

  angular
    .module('common.patient')
    .directive('scheduleList', scheduleList);

  scheduleList.$inject = [];

  /* @ngInject */
  function scheduleList() {
    var directive = {
      bindToController: true,
      controller: ScheduleListController,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        onPatientSelect: '&',
        scheduleType: '='
      },
      templateUrl: '../common/patient/directives/scheduleList.html'
    };
    return directive;
  }

  ScheduleListController.$inject = ['scheduleService'];

  /* @ngInject */
  function ScheduleListController(scheduleService) {

    var SCHEDULE_TYPE_CURRENT_PROVIDER = 'currentProvider';
    var SCHEDULE_TYPE_DRUG_PICKUP = 'drugPickup';

    var vm = this;

    vm.patients = [];

    activate();

    ////////////////

    function activate() {
      var getSchedule;

      if (vm.scheduleType === SCHEDULE_TYPE_CURRENT_PROVIDER) {
        getSchedule = scheduleService.getCurrentProviderSchedule();
      } else if (vm.scheduleType === SCHEDULE_TYPE_DRUG_PICKUP) {
        getSchedule = scheduleService.getDrugPickupSchedule();
      } else {
        getSchedule = scheduleService.getPatientSchedule();
      }

      getSchedule.then(function (patients) {
        vm.patients = patients;
      });
    }
  }

})();
