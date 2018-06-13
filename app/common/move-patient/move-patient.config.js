(function () {
  'use strict';

  angular
    .module('movepatient')
    .config(configMovePatient);

  configMovePatient.$inject = ['$stateProvider'];

  /* @ngInject */
  function configMovePatient($stateProvider) {
    $stateProvider
      .state('mvp', {
        url: '/mvp/:patientUuid'
      })
  }

})();
