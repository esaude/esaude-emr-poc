(function () {
  'use strict';

  angular
    .module('clinic')
    .controller('PatientCommonController', PatientCommonController);

  PatientCommonController.$inject = ['$filter', '$scope', 'conceptService', 'notifier', 'patientService'];


  /* @ngInject */
  function PatientCommonController($filter, $scope, conceptService, notifier, patientService) {



  }

})();
