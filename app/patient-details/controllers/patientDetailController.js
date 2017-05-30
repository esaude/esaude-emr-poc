(function () {
  'use strict';

  angular.module('patient.details')
    .controller('DetailPatientController', DetailPatientController);

  DetailPatientController.$inject = ["$scope", "$stateParams", "$location", "$http", "$rootScope", "$compile", "$timeout", "$q", "reportService"];

  function DetailPatientController($scope, $stateParams, $location, reportService) {
    var vm = this;

    vm.patient = $scope.patient;
    vm.patientAttributes = [];
    vm.initAttributes = initAttributes;
    vm.linkDashboard = linkDashboard;
    vm.print = print;

    function initAttributes() {
      vm.patientAttributes = [];
      angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
        angular.forEach(value, function (value) {
          vm.patientAttributes.push(value);
        });
      });
    }

    function linkDashboard() {
      $location.url("/dashboard/" + $stateParams.patientUuid); // path not hash
    }

    function print() {
      reportService.printPatientARVPickupHistoryReport(vm.patient);
    }
  }
})();
