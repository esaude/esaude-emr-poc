(function () {
  'use strict';

  angular
    .module('poc.common.prescription')
    .component('dateAndProviderModal', {
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: DateAndProviderModal,
      controllerAs: 'vm',
      templateUrl: '../common/prescription/components/dateAndProviderModal.html',
    });

  /* @ngInject */
  function DateAndProviderModal(providerService, notifier) {

    var now = new Date();

    var vm = this;

    vm.datepickerOptions = {maxDate: now};
    vm.showMessages = false;
    vm.selectedProvider = null;

    vm.$onInit = $onInit;
    vm.ok = ok;
    vm.cancel = cancel;
    vm.searchProviders = searchProviders;

    function $onInit() {
      vm.selectedProvider = vm.resolve.selectedProvider;
      vm.prescriptionDate = vm.resolve.prescriptionDate;
    }

    function ok(form) {

      if (!form.$valid) {
        vm.showMessages = true;
        return;
      }

      vm.close({$value: {date: vm.prescriptionDate, provider: vm.selectedProvider}});
    }

    function cancel() {
      vm.dismiss({$value: 'cancel'});
    }

    function searchProviders(term) {
      return providerService.getProviders(term, {ignoreLoadingBar: true})
        .catch(() => {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }

  }

})();
