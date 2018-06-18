(function () {
  'use strict';

  angular
    .module('poc.common.visit')
    .component('pocRequireCheckIn', {
      controller: RequireCheckInController,
      controllerAs: 'vm',
      bindings: {
        patient: '<',
        showMessage: '<',
        message: '@'
      },
      templateUrl: '../common/visit/components/pocRequireCheckIn.html',
      transclude: {
        showAnyway: '?showAnyway'
      }
    });

  /* @ngInject */
  function RequireCheckInController(visitService) {

    var vm = this;

    vm.checkedIn = false;

    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;

    function $onInit() {
      if (vm.message) {
        vm.showMessage = true;
      }
    }

    function $onChanges(changesObj) {
      if (changesObj.patient && changesObj.patient.currentValue.uuid) {
        // TODO: might be necessary to cache this call
        visitService.getTodaysVisit(changesObj.patient.currentValue.uuid).then(visitToday => {
          vm.checkedIn = visitToday !== null;
        });
      }
    }
  }

})();
