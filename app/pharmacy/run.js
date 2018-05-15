(function () {
  'use strict';

  angular
    .module('pharmacy')
    .run(runPharmacy);

  /* @ngInject */
  function runPharmacy ($transitions, authorizationService) {
    $transitions.onBefore({to: 'dashboard'}, function (transition) {
      return authorizationService.hasRole(['POC: Pharmacist - Independent', 'POC: Pharmacist - Independent (Admin)']).then(function (hasRole) {
        var target = hasRole ? 'dashboard.prescriptions' : 'dashboard.filaHistory';
        return transition.router.stateService.target(target, {patientUuid: transition.params().patientUuid});
      });
    });
  }

})();
