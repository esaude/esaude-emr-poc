(function () {
  'use strict';

  angular
    .module('pharmacy')
    .component('cancelDispensationItemModal', {
      bindings: {
        dispensationItemToCancel: '<'
      },
      controllerAs: 'vm',
      templateUrl: '../pharmacy/components/cancelDispensationItemModal.html'
    });

})();
