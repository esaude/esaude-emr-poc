(() => {
  'use strict';

  angular
    .module('common.patient')
    .component('patientDeath', {
      bindings: {
        patient: '<'
      },
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/details/patientDeath.html',
    });

})();
