(function () {
  'use strict';

  angular
    .module('registration')
    .controller('VisitHistoryController', VisitHistoryController);

  VisitHistoryController.$inject = ['$stateParams', 'notifier', 'spinner', 'visitService'];

  /* @ngInject */
  function VisitHistoryController($stateParams, notifier, spinner, visitService) {

    var vm = this;
    vm.visitHistory = [];

    activate();

    ////////////////

    function activate() {
      spinner.forPromise(getVisitHistory());
    }

    function getVisitHistory() {
      return visitService.getVisitHistoryForPatient({uuid: $stateParams.patientUuid})
        .then(function (visitHistory) {
          vm.visitHistory = visitHistory;
        });
    }
  }

})();

