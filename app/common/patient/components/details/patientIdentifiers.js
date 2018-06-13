(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientIdentifiers', {
      bindings: {
        patient: '<'
      },
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/details//patientIdentifiers.html',
    });

})();
