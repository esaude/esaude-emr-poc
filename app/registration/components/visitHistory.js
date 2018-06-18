(function () {
  'use strict';

  angular
    .module('registration')
    .component('visitHistory', {
      bindings: {
        patient: '<'
      },
      controller: VisitHistoryController,
      controllerAs: 'vm',
      templateUrl: '../registration/components/visitHistory.html',
    });

  /* @ngInject */
  function VisitHistoryController(visitService) {

    var vm = this;

    vm.visitHistory = [];

    vm.$onInit = $onInit;

    function $onInit() {
      getVisitHistory();
    }

    function getVisitHistory() {
      return visitService.getVisitHistoryForPatient(vm.patient)
        .then(visitHistory => {
          vm.visitHistory = visitHistory;
        });
    }
  }

})();

