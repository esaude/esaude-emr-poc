(function () {
  'use strict';

  angular
    .module('visit')
    .component('requireCheckIn', {
      controller: RequireCheckInController,
      controllerAs: 'vm',
      bindings: {
        patient: '<'
      },
      templateUrl: '../visit/components/requireCheckIn.html',
      transclude: true
    });

  /* @ngInject */
  function RequireCheckInController(visitService) {

    var vm = this;

    vm.checkedIn = false;

    vm.$onChanges = $onChanges;

    function $onChanges(changesObj) {
      if (changesObj.patient && changesObj.patient.currentValue) {
        visitService.getTodaysVisit(changesObj.patient.currentValue.uuid).then(function (visitToday) {
          vm.checkedIn = visitToday !== null;
        });
      }
    }
  }

})();
