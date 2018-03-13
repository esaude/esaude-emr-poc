(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.serviceform')
    .controller('FormPrintController', FormPrintController);

  FormPrintController.$inject = ['$state', '$stateParams', 'clinicalServicesService', 'notifier', 'patientService',
    'spinner', 'translateFilter'];

  /* @ngInject */
  function FormPrintController($state, $stateParams, clinicalServicesService, notifier, patientService, spinner,
                               translateFilter) {

    var encounter = $stateParams.encounter;
    var serviceId = $stateParams.serviceId;
    var returnState = $stateParams.returnState;

    var vm = this;

    vm.patient = {};
    vm.formPayload = null;
    vm.formInfo = null;
    vm.patientUUID = $stateParams.patientUuid;

    vm.linkDashboard = linkDashboard;

    activate();

    ////////////////

    function activate() {
      var service = {id: serviceId};

      vm.formInfo = clinicalServicesService.getFormLayouts({id: serviceId});

      var load = patientService.getPatient(vm.patientUUID)
        .then(function (patient) {
          vm.patient = patient;
          return clinicalServicesService.getFormData(vm.patient, service, encounter);
        }).then(function (formData) {
          vm.formPayload = formData;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });

      spinner.forPromise(load);
    }

    function linkDashboard() {
      $state.go(returnState, {patientUuid: vm.patientUUID});
    }
  }

})();
