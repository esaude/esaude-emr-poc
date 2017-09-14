(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.serviceform')
    .controller('FormPrintController', FormPrintController);

  FormPrintController.$inject = ['$state', '$stateParams', 'clinicalServicesService', 'spinner'];

  /* @ngInject */
  function FormPrintController($state, $stateParams, clinicalServicesService, spinner) {

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

      vm.formInfo = clinicalServicesService.getFormLayouts({id: serviceId});

      var load = clinicalServicesService.getFormData(patient, service, encounter).then(function (formData) {
        vm.formPayload = formData;
      });

      spinner.forPromise(load);
    }

    function linkDashboard() {
      $state.go('dashboard', {patientUuid: patientUUID});
    }
  }

})();
