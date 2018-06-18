(() => {
  'use strict';

  angular
    .module('clinic')
    .run(runClinical);

  runClinical.$inject = ['$transitions'];

  /* @ngInject */
  function runClinical ($transitions) {
    $transitions.onBefore({to: 'dashboard'}, transition => transition.router.stateService.target('dashboard.summary', {patientUuid: transition.params().patientUuid}));
  }

})();
