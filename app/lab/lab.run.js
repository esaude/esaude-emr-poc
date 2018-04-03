(function () {
  'use strict';

  angular
    .module('lab')
    .run(runLab);

  runLab.$inject = ['$transitions'];

  /* @ngInject */
  function runLab ($transitions) {
    $transitions.onBefore({to: 'dashboard'}, function (transition) {
      return transition.router.stateService.target('dashboard.testorders', {patientUuid: transition.params().patientUuid});
    });
  }

})();
