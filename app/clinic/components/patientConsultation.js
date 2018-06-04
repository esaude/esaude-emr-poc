(function () {
  'use strict';

  angular.module('clinic')
    .component('patientConsultation', {
      bindings: {
        patient: '<'
      },
      controllerAs: 'vm',
      templateUrl: '../clinic/components/patientConsultation.html'
    });

})();
