(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.serviceform')
    .component('formDisplay', {
      controller: FormDisplayController,
      controllerAs: 'vm',
      templateUrl: '../poc-common/clinical-services/service-form/components/formDisplay.html'
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
        .then(function (patient) {
          vm.patient = patient;
          return clinicalServicesService.getFormData(vm.patient, service, encounter);
        }).then(function (formData) {
          vm.formPayload = formData;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkDashboard() {
      $state.go(returnState, {patientUuid: vm.patientUUID});
    }
  }

})();
