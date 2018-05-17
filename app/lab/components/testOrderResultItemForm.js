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
    vm.isNumeric = isNumeric;
    vm.hasError = hasError;
    vm.hasSuccess = hasSuccess;
    vm.isInvalid = isInvalid;
    vm.onFocus = onFocus;
    vm.onBlur = onBlur;

    function $onChanges(changesObj) {
      if (changesObj.item) {
        setItem(changesObj.item.currentValue);
      }
    }

    function isNumeric() {
      return vm.$item.testOrder.concept.datatype.display === 'Numeric';
    }

    function hasError(form) {
      return vm.hasFocus && form.$dirty && !form.$valid;
    }

    function hasSuccess(form) {
      return vm.hasFocus && form.$dirty && form.$valid;
    }

    function isInvalid(form) {
      return form.$dirty && !form.$valid;
    }

    function onFocus() {
      vm.hasFocus = true;
      vm.showButtons = true;
    }

    function onBlur(form) {
      vm.hasFocus = false;

      if (form.$invalid) {
        setItem(vm.item);
        form.$setPristine();
      }

      if (vm.$item.value == vm.item.value) { // Loose equality is intended. Numeric datatypes values come as strings.
        vm.showButtons = false;
      }
    }

    function setItem(item) {
      vm.$item = angular.copy(item);
      if (vm.$item.testOrder.concept.datatype.display === 'Numeric' && vm.$item.value !== "") {
        vm.$item.value = +vm.$item.value;
      }
    }
  }

})();
