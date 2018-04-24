(function () {
  'use strict';

  angular
    .module('lab')
    .component('testOrderResultDetails', {
      controller: TestOrderDetailsController,
      controllerAs: 'vm',
      bindings: {
        testOrderResult: '<',
        reloadTestOrderResult: '&'
      },
      templateUrl: '../lab/components/testOrderResultDetails.html'
    });


  TestOrderDetailsController.$inject = ['$timeout', 'notifier', 'translateFilter', '$q',  'testOrderResultService'];

  /* @ngInject */
  function TestOrderDetailsController($timeout, notifier, translateFilter, $q,  testOrderResultService) {

    var vm = this;

    vm.getTestOrderItemValue = getTestOrderItemValue;
    vm.saveTestResultItem = saveTestResultItem;
    vm.removeTestResultItem = removeTestResultItem;

    function saveTestResultItem(item, result) {
      var index = findItem(item);
      var changedItem = angular.copy(vm.testOrderResult.items[index]);

      testOrderResultService.saveTestResultItem(vm.testOrderResult, _.merge({}, changedItem, {value: result}))
        .then(function (testResultItem) {
          changedItem.uuid = testResultItem.uuid;
          changedItem.value = testResultItem.value;
          notifier.success(translateFilter('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
        })
        .catch(function (error) {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        })
        .finally(function () {
          vm.testOrderResult.items[index] = changedItem;
        });
    }

    function getTestOrderItemValue(testOrderItem) {
      var value = testOrderItem.value;
      var orderConcept = testOrderItem.testOrderResult.concept;
      if (orderConcept && (orderConcept.datatype.display === 'Coded')) {
        var answer = orderConcept.answers.find(function (a) {
          return a.uuid === testOrderItem.value;
        });
        if (answer) {
          value = answer.display;
        }
      }
      return value;
    }

    function removeTestResultItem(item) {
      testOrderResultService.removeTestResultItem(vm.testOrderResult, item)
        .then(function () {
          vm.reloadTestOrderResult();
          notifier.success(translateFilter('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
        })
        .catch(function (error) {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });

    }

    function findItem(item) {
      return vm.testOrderResult.items.indexOf(item);
    }

  }

})();
