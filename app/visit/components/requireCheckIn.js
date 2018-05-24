(function () {
  'use strict';

  angular
    .module('visit')
    .component('pocRequireCheckIn', {
      controller: RequireCheckInController,
      controllerAs: 'vm',
      bindings: {
        patient: '<',
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

    vm.$onChanges = $onChanges;

    function $onChanges(changesObj) {
      if (changesObj.patient && changesObj.patient.currentValue.uuid) {
        visitService.getTodaysVisit(changesObj.patient.currentValue.uuid).then(function (visitToday) {
          vm.checkedIn = visitToday !== null;
        });
      }
    }
  }

})();
