(function () {
  'use strict';

  angular
    .module('visit')
    .component('pocRequireCheckIn', {
      controller: RequireCheckInController,
      controllerAs: 'vm',
      bindings: {
        patient: '<',
        showMessage: '<',
        message: '@'
      },
      templateUrl: '../visit/components/requireCheckIn.html',
      transclude: {
        showAnyway: '?showAnyway'
      }
    });

  /* @ngInject */
  function RequireCheckInController(visitService) {

    var vm = this;

    vm.checkedIn = false;

    vm.$onInit = $onInit();
    vm.$onChanges = $onChanges;

    function $onInit() {
      if (vm.message) {
        vm.showMessage = true;
      }
    }

    function $onChanges(changesObj) {
      if (changesObj.patient && changesObj.patient.currentValue.uuid) {
        visitService.getTodaysVisit(changesObj.patient.currentValue.uuid).then(function (visitToday) {
          vm.checkedIn = visitToday !== null;
        });
      }
    }
  }

})();
