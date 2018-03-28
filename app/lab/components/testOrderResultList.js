(function () {
  'use strict';

  angular
    .module('lab')
    .component('testOrderResultList', {
      controller: TestOrderListController,
      controllerAs: 'vm',
      bindings: {
        testOrderResults: '<',
        onSelectTestOrderResult: '&'
      },
      templateUrl: '../lab/components/testOrderResultList.html'
    });

  TestOrderListController.$inject = ['$stateParams', '$uibModal'];

  /* @ngInject */
  function TestOrderListController() {
  }

})();
