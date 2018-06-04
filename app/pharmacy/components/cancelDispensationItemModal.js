(function () {
  'use strict';

  angular
    .module('pharmacy')
    .component('cancelDispensationItemModal', {
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: CancelDispensationItemModalController,
      controllerAs: 'vm',
      templateUrl: '../pharmacy/components/cancelDispensationItemModal.html'
    });

  function CancelDispensationItemModalController() {

    var vm = this;

    vm.dispensationItem = vm.resolve.dispensationItem;
    vm.cancelationReason = '';

    vm.ok = ok;
    vm.cancel = cancel;

    function ok() {
      vm.close({$value: vm.cancelationReason});
    }

    function cancel() {
      vm.dismiss({$value: 'cancel'});
    }
  }

})();
