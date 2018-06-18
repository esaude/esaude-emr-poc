(() => {
  'use strict';

  angular
    .module('social')
    .run(runSocial);

  runSocial.$inject = ['$transitions'];

  /* @ngInject */
  function runSocial ($transitions) {
    $transitions.onBefore({to: 'dashboard'}, transition => transition.router.stateService.target('dashboard.services', {patientUuid: transition.params().patientUuid}));
  }

})();
