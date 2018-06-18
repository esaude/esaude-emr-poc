(() => {
  'use strict';

  angular
    .module('registration')
    .run(runRegistration);

    runRegistration.$inject = ['$transitions'];

    /* @ngInject */
    function runRegistration ($transitions) {
      $transitions.onBefore({to: 'dashboard'}, transition => transition.router.stateService.target('dashboard.program', {patientUuid: transition.params().patientUuid}));
    }

})();
