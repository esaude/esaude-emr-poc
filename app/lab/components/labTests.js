(function () {
  'use strict';

  angular
    .module('lab')
    .component('labTests', {
      controller: LabTestsController,
      controllerAs: 'vm',
      templateUrl: '../lab/components/labTests.html'
    });

  LabTestsController.$inject = ['$q', '$scope', '$stateParams', 'notifier', 'testOrderResultService', 'translateFilter',
    'conceptService', 'orderService', 'spinner'];

  function LabTestsController($q, $scope, $stateParams, notifier, testOrderResultService, translateFilter, conceptService,
                              orderService, spinner) {

    var vm = this;

    vm.testOrderResults = [];
    vm.selectedTestOrder = {testOrderItems: []};

    vm.$onInit = $onInit;
    vm.selectTestOrderResult = selectTestOrderResult;
    vm.reloadTestOrderResult = reloadTestOrderResult;

    function $onInit() {
      testOrderResultService.getTestOrderResultsForPatient({uuid: $stateParams.patientUuid})
        .then(function (testOrders) {
          vm.testOrderResults = testOrders;
          selectTestOrderResult(testOrders[0]);
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function selectTestOrderResult(testOrder) {
      if (testOrder.selected) {
        return;
      }

      var loadConcepts = loadOrderItemConcepts(testOrder)
        .then(function () {
          vm.selectedTestOrder = testOrder;
          vm.selectedTestOrder.selected = true;
          vm.testOrderResults.forEach(function (o) {
            if (o !== vm.selectedTestOrder) {
              o.selected = false;
            }
          });
        });

      spinner.forPromise(loadConcepts);
    }

    function reloadTestOrderResult(testOrderResult) {

      var i = vm.testOrderResults.indexOf(testOrderResult);

      testOrderResultService.getTestOrderResult(testOrderResult.uuid)
        .then(function (reloadedTestOrderResult) {
          vm.testOrderResults[i] = reloadedTestOrderResult;
          selectTestOrderResult(vm.testOrderResults[i]);
        });
    }

    function getOrder(uuid) {
      return orderService.getOrder(uuid);
    }

    function getConcept(uuid) {
      return conceptService.getConcept(uuid);
    }

    /**
     * Loads concepts for each of this order's testOrderItem
     * @returns {Promise[]}
     */
    function loadOrderItemConcepts(testOrder) {
      var loadConcept = testOrder.items.map(function (i) {
        return getOrder(i.testOrder.uuid)
          .then(function (order) {
            return getConcept(order.concept.uuid);
          })
          .then(function (concept) {
            i.testOrder.concept = concept;
            return concept;
          })
      });
      return $q.all(loadConcept)
        .catch(function (error) {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }
  }

})();
