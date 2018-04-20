(function () {
  'use strict';

  angular
    .module('registration')
    .controller('VisitHistoryController', VisitHistoryController);

  VisitHistoryController.$inject = ['$stateParams',  'visitService'];

  /* @ngInject */
  function VisitHistoryController($stateParams,  visitService) {

    var vm = this;
    vm.visitHistory = [];

    activate();

    ////////////////

    function activate() {
      getVisitHistory();
    }

    function getVisitHistory() {
      return visitService.getVisitHistoryForPatient({uuid: $stateParams.patientUuid})
        .then(function (visitHistory) {
          vm.visitHistory = visitHistory;
        });
    }
  }

})();

