(function () {
  'use strict';

  angular
    .module('pharmacy')
    .run(runPharmacy);

  runPharmacy.$inject = ['$transitions'];

  /* @ngInject */
  function runPharmacy ($transitions) {
    $transitions.onBefore({to: 'dashboard'}, function (transition) {
      return transition.router.stateService.target('dashboard.prescriptions', {patientUuid: transition.params().patientUuid});
    });
  }

})();
