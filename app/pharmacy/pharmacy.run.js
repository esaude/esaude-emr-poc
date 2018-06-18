(() => {
  'use strict';

  angular
    .module('pharmacy')
    .run(runPharmacy);

  /* @ngInject */
  function runPharmacy ($transitions, authorizationService) {
    $transitions.onBefore({to: 'dashboard'}, transition => authorizationService.hasRole(['POC: Pharmacist - Independent', 'POC: Pharmacist - Independent (Admin)']).then(hasRole => {
      var target = hasRole ? 'dashboard.prescriptions' : 'dashboard.filaHistory';
      return transition.router.stateService.target(target, {patientUuid: transition.params().patientUuid});
    }));
  }

})();
