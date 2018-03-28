(function () {
  'use strict';

  angular
    .module('lab')
    .component('testOrderResultItemForm', {
      controller: TestOrderItemFormController,
      controllerAs: 'vm',
      bindings: {
        item: '<',
        onSubmit: '&',
        onRemove: '&'
      },
      templateUrl: '../lab/components/testOrderResultItemForm.html'
    });


  TestOrderItemFormController.$inject = [];

  function TestOrderItemFormController() {

    var vm = this;

    vm.$item = {};
    vm.$onChanges = $onChanges;

    function $onChanges(changesObj) {
      if (changesObj.item) {
        vm.$item = angular.copy(changesObj.item.currentValue);
        if (vm.$item.testOrder.concept.datatype.display === 'Numeric' && vm.$item.value !== "") {
          vm.$item.value = +vm.$item.value;
        }
      }
    }
  }

})();
