(function () {
  'use strict';

  angular
    .module('poc.common.prescription')
    .component('cancelPrescriptionModal', {
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: CancelPrescriptionModal,
      controllerAs: 'vm',
      templateUrl: '../common/prescription/components/cancelPrescriptionModal.html',
    });

  /* @ngInject */
  function CancelPrescriptionModal(providerService, notifier) {

    var vm = this;

    vm.prescriptionItemToCancel = {};
    vm.cancellationReason = '';

    vm.$onInit = $onInit;
    vm.ok = ok;
    vm.cancel = cancel;
    vm.searchProviders = searchProviders;

    function $onInit() {
      vm.prescriptionItemToCancel = vm.resolve.prescriptionItemToCancel;
      vm.cancellationReasons = vm.resolve.cancellationReasons;
    }

    function ok(form) {

      if (!form.$valid) {
        vm.showMessages = true;
        return;
      }

      vm.close({$value: {cancellationReason: vm.cancellationReason}});
    }

    function cancel() {
      vm.dismiss({$value: 'cancel'});
    }

    function searchProviders(term) {
      return providerService.getProviders(term)
        .catch(() => {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }

  }

})();
