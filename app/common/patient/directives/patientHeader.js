(function () {
  'use strict';

  angular
    .module('common.patient')
    .directive('patientHeader', patientHeader);

  /* @ngInject */
  function patientHeader() {
    var directive = {
      bindToController: true,
      controller: PatientHeaderController,
      controllerAs: 'vm',
      restrict: 'AE',
      scope: {
        patient: '='
      },
      templateUrl: '../common/patient/directives/patientHeader.html'
    };
    return directive;
  }

  /* @ngInject */
  function PatientHeaderController() {
  }

})();

