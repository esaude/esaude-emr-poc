(function () {
  'use strict';

  angular
    .module('registration')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$location', '$stateParams'];

  /* @ngInject */
  function DashboardController($location, $stateParams) {

    var patientUuid;

    var vm = this;
    vm.linkSearch = linkSearch;
    vm.linkVisit = linkVisit;
    vm.linkPatientDetail = linkPatientDetail;
    vm.linkServicesList = linkServicesList;
    vm.linkPatientEdit = linkPatientEdit;

    activate();

    ////////////////

    function activate() {
      patientUuid = $stateParams.patientUuid;
    }

    function linkSearch() {
      $location.url("/search"); // path not hash
    }

    function linkVisit() {
      $location.url("/visit/" + patientUuid); // path not hash
    }

    function linkPatientDetail() {
      $location.url("/patient/detail/" + patientUuid); // path not hash
    }

    function linkServicesList() {
      $location.url("/services/" + patientUuid); // path not hash
    }

    function linkPatientEdit() {
      $location.url("/patient/edit/" + patientUuid + "/identifier"); // path not hash
    }
  }

})();

