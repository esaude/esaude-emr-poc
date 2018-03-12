(function () {
  'use strict';

  angular.module('clinic')
    .controller('LabRequestController', LabRequestController);

  LabRequestController.$inject = ['$rootScope', '$stateParams', 'providerService', 'testProfileService', 'testService',
    'notifier', '$filter', 'testOrderService', 'sessionService'];

  function LabRequestController($rootScope, $stateParams, providerService, testProfileService, testService, notifier,
    $filter, testOrderService, sessionService) {

    var patientUuid = $stateParams.patientUuid;
    var patient = {};
    var vm = this;
    vm.showMessages = false;

    //requisições externas possuem alguns campos adicionais
    vm.externalRequest = true;

    vm.providers = [];
    vm.profiles = [];
    vm.tests = [];
    vm.selectedTests = [];
    vm.existingTestOrders = [];
    vm.testsOfSelectedRequest = [];
    vm.selectedProvider = null;
    vm.date = null;
    vm.selectedProfile = null;
    vm.selectedTest = null;
    vm.testOrderInDetail = null;
    vm.dateOptions = { maxDate: new Date() };

    vm.addTest = addTest;
    vm.addTestProfile = addTestProfile;
    vm.removeTest = removeTest;
    vm.saveTestOrderRequest = saveTestOrderRequest;
    vm.showTestOrderDetails = showTestOrderDetails;
    vm.deleteTest = deleteTest;
    vm.resetForm = resetForm;

    activate();

    function activate() {
      providerService.getProviders().then(function (providers) {
        vm.providers = providers;
      });
      testProfileService.getTestProfiles().then(function (testProfiles) {
        vm.profiles = testProfiles;
      });
      testService.getTests().then(function (tests) {
        vm.tests = tests;
      });
      loadExistingTestOrders();
    }

    function loadExistingTestOrders() {
      testOrderService.getTestOrdersByPatientUuid(patientUuid).then(function (testOrders) {
        vm.existingTestOrders = testOrders;
      });
    }

    function addTest() {
      if (vm.selectedTest && vm.selectedTest.display) {
        var alreadyContainsTest = vm.selectedTests.indexOf(vm.selectedTest) != -1;
        if (!alreadyContainsTest) {
          vm.selectedTest.profileName = null;
          vm.selectedTests.push(vm.selectedTest);
          vm.selectedTest = null;
        } else {
          notifier.error($filter('translate')('TEST_ALREADY_ADDED'));
        }
      } else {
        notifier.error($filter('translate')('SELECT_TEST_FROM_LIST'));
      }
    }

    function addTestProfile() {
      if (vm.selectedProfile && vm.selectedProfile.name) {
        var testUuids = vm.selectedProfile.tests;
        testUuids.forEach(function (uuid) {
          var test = getTestByUuid(uuid);
          if (test != null) {
            var alreadyContainsTest = vm.selectedTests.indexOf(test) != -1;
            if (!alreadyContainsTest) {
              test.profileName = vm.selectedProfile.name;
              vm.selectedTests.push(test);
            }
          } else {
            console.error("Teste com uuid " + uuid + " não encontrado");
            return;
          }
        });
        vm.selectedProfile = null;
      } else {
        notifier.error($filter('translate')('SELECT_PROFILE_FROM_LIST'));
      }
    }

    function getTestByUuid(uuid) {
      var foundTest = null;
      vm.tests.forEach(function (test) {
        if (test.testOrder.uuid == uuid) {
          foundTest = test;
        }
      });
      return foundTest;
    }

    function removeTest(test) {
      vm.selectedTests.splice(vm.selectedTests.indexOf(test), 1);
    }

    function saveTestOrderRequest() {
      if (vm.selectedProvider && vm.selectedProvider.display) {
        if (vm.selectedTests.length > 0) {
          var testOrder = {
            patient: { uuid: patientUuid },
            provider: { uuid: vm.selectedProvider.uuid },
            location: { uuid: sessionService.getCurrentLocation().uuid },
            dateCreation: vm.date,
            testOrderItems: []
          }
          vm.selectedTests.forEach(function (test) {
            testOrder.testOrderItems.push({
              testOrder: {
                type: "testorder",
                concept: { uuid: test.testOrder.uuid }
              },
              category: { uuid: test.category.uuid }
            });
          });
          testOrderService.create(testOrder).then(function (data) {
            notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
            loadExistingTestOrders();
            resetForm();
          }).catch(function (error) {
            var testAlreadyRequestedMessage = error.data.error.message.indexOf("was(were) already be requested") != -1;
            if (testAlreadyRequestedMessage) {
              notifier.error($filter('translate')('TEST_ALEADY_REQUESTED_ON_SAME_DATE'));
            }
          });
        } else {
          notifier.error($filter('translate')('ADD_AT_LEAST_ONE_TEST_TO_TEST_ORDER'));
        }
      } else {
        notifier.error($filter('translate')('SELECT_PROVIDER_FROM_LIST'));
      }
    }

    function showTestOrderDetails(testOrder) {
      vm.testsOfSelectedRequest = testOrder.testOrderItems;
      vm.testOrderInDetail = testOrder;
    }

    function deleteTest(test) {
      testOrderService.deleteTestOrder(vm.testOrderInDetail.encounter.uuid, test.testOrder.uuid).success(function (data) {
        vm.testsOfSelectedRequest.splice(vm.testsOfSelectedRequest.indexOf(test), 1);

        //se for removido o ultimo teste da requisicao entao a requisicao sera removida na totalidade, precisaremos actualizar
        //a lista de requisições
        if (vm.testsOfSelectedRequest.length == 0) {
          loadExistingTestOrders();
        }
      });
    }

    function resetForm() {
      vm.date = null;
      vm.selectedProvider = null;
      vm.selectedTest = null;
      vm.selectedProfile = null;
      vm.selectedTests = null;
    }
  }

})();
