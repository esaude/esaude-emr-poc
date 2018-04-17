(function () {
  'use strict';

  angular
    .module('registration')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$stateParams', 'notifier', 'patientService', 'translateFilter', 'spinner'];

  /* @ngInject */
  function DashboardController($state, $stateParams, notifier, patientService, translateFilter, spinner) {

    var patientUUID = $stateParams.patientUuid;

    var vm = this;

    vm.patient = {};

    vm.linkSearch = linkSearch;
    vm.reload = reload;

    activate();

    ////////////////

    function activate() {
      loadPatient();
    }

    function linkSearch() {
      $state.go('search');
    }

    function reload() {
      $state.reload();
    }

    function loadPatient() {
      var promise = getPatient(patientUUID)
        .then(function (patient) {
          vm.patient = patient;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });

      spinner.forPromise(promise);

      return promise;
    }


    function getPatient(uuid) {
      return patientService.getPatient(uuid);
    }
  }

})();

