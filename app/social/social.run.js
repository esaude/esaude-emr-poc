(function () {
  'use strict';

  angular
    .module('social')
    .run(runSocial);

  runSocial.$inject = ['$transitions'];

  /* @ngInject */
  function runSocial ($transitions) {
    $transitions.onBefore({to: 'dashboard'}, function (transition) {
      return transition.router.stateService.target('dashboard.services', {patientUuid: transition.params().patientUuid});
    });
  }

})();
