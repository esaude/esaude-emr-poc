(function () {
  'use strict';

  angular.module('clinic')
    .controller('LabRequestController', LabRequestController);

  LabRequestController.$inject = ['$rootScope', '$stateParams', 'providerService', 'testProfileService', 'testService', 'notifier', '$filter'];

  function LabRequestController($rootScope, $stateParams, providerService, testProfileService, testService, notifier, $filter) {
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
    vm.selectedProvider = null;
    vm.date = null;
    vm.selectedProfile = null;
    vm.selectedTest = null;

    vm.addTest = addTest;
    vm.addTestProfile = addTestProfile;

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
          var alreadyContainsTest = vm.selectedTests.indexOf(test) != -1;
          if (!alreadyContainsTest) {
            test.profileName = vm.selectedProfile.name;
            vm.selectedTests.push(test);
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
  }

})();
