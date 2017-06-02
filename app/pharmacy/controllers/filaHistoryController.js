(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('FilaHistoryController', FilaHistoryController);

  FilaHistoryController.$inject = ['$stateParams', 'encounterService'];

  function FilaHistoryController($stateParams, encounterService) {
    var vm = this;
    vm.pickups = [];

    activate();

    ////////////////

    function activate() {
      var patientUuid = $stateParams.patientUuid;
      encounterService.getPatientPharmacyEncounters(patientUuid).then(function (encounters) {
        vm.pickups = encounters;
      });
    }
  }

})();
