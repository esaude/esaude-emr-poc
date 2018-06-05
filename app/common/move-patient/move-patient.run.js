(function () {
  'use strict';

  angular
    .module('movepatient')
    .run(runMovePatient);

  runMovePatient.$inject = ['$transitions'];

  /* @ngInject */
  function runMovePatient($transitions) {
    $transitions.onBefore({to: 'mvp'}, function (transition) {
      return transition.router.stateService.target('dashboard', {patientUuid: transition.params().patientUuid});
    });
  }

})();
