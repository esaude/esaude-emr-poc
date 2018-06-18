(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .component('formDisplay', {
      controller: FormDisplayController,
      controllerAs: 'vm',
      templateUrl: '../common/clinical-services/components/formDisplay.html'
    });

  FormDisplayController.$inject = ['$state', '$stateParams', 'clinicalServicesService', 'notifier', 'patientService',
     'translateFilter'];

  /* @ngInject */
  function FormDisplayController($state, $stateParams, clinicalServicesService, notifier, patientService,
                               translateFilter) {

    var encounter = $stateParams.encounter;
    var serviceId = $stateParams.serviceId;
    var returnState = $stateParams.returnState;

    var vm = this;

    vm.patient = {};
    vm.formPayload = null;
    vm.formInfo = null;
    vm.patientUUID = $stateParams.patientUuid;

    vm.$onInit = $onInit;
    vm.linkDashboard = linkDashboard;

    ////////////////

    function $onInit() {
      var service = {id: serviceId};

      vm.formInfo = clinicalServicesService.getFormLayouts({id: serviceId});

      patientService.getPatient(vm.patientUUID)
        .then(patient => {
          vm.patient = patient;
          return clinicalServicesService.getFormData(vm.patient, service, encounter);
        }).then(formData => {
          vm.formPayload = formData;
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkDashboard() {
      $state.go(returnState, {patientUuid: vm.patientUUID});
    }
  }

})();
