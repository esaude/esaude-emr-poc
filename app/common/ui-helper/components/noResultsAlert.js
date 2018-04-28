(function () {
  'use strict';

  angular
    .module('bahmni.common.uiHelper')
    .component('noResultsAlert', {
      controllerAs: 'vm',
      bindings: {
        collection: '<',
        message: '@'
      },
      templateUrl: '../common/ui-helper/components/noResultsAlert.html'
    });

})();
