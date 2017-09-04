(function () {
  'use strict';

  angular
    .module('serviceform')
    .controller('FormPrintController', FormPrintController);

  FormPrintController.$inject = ['$state', '$stateParams', 'clinicalServiceForms'];

  /* @ngInject */
  function FormPrintController($state, $stateParams, clinicalServiceForms) {

    var patientUUID = $stateParams.patientUuid;
    var encounter = $stateParams.encounter;
    var serviceId = $stateParams.serviceId;

    var vm = this;

    vm.formPayload = null;
    vm.formInfo = null;

    vm.linkDashboard = linkDashboard;

    activate();

    ////////////////

    function activate() {
      var patient = {uuid: patientUUID};
      var service = {id: serviceId};

      vm.formInfo = clinicalServiceForms.getFormLayouts({id: serviceId});

      clinicalServiceForms.getFormData(patient, service, encounter).then(function (formData) {
        vm.formPayload = formData;
      });
    }

    function linkDashboard() {
      $state.go('dashboard', {patientUuid: patientUUID});
    }
  }

})();
