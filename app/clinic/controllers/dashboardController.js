(function () {
  'use strict';

  angular
    .module('clinic')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$rootScope', '$scope', '$location', '$stateParams', '$filter', 'patientService',
    'alertService', 'visitService', 'commonService'];

  /* @ngInject */
  function DashboardController($rootScope, $scope, $location, $stateParams, $filter, patientService, alertService,
    visitService, commonService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    $scope.patientUUID = $stateParams.patientUuid;

    activate();

    ////////////////

    function activate() {
      patientService.getPatient($scope.patientUUID).then(function (patient) {
        $rootScope.patient = patient;
      });
      visitService.search({patient: $scope.patientUuid, v: "full"})
        .success(function (data) {
          var nonRetired = commonService.filterRetired(data.results);
          //in case the patient has an active visit
          if (!_.isEmpty(nonRetired)) {
            var lastVisit = _.maxBy(nonRetired, 'startDatetime');
            var now = dateUtil.now();
            //is last visit todays
            if (dateUtil.parseDatetime(lastVisit.startDatetime) <= now &&
              dateUtil.parseDatetime(lastVisit.stopDatetime) >= now) {
              $scope.hasVisitToday = true;
              $scope.todayVisit = lastVisit;
            } else {
              $scope.hasVisitToday = false;
            }
          }
        });
    }

    $scope.linkSearch = function() {
      $location.url("/search"); // path not hash
    };

    $scope.linkPatientDetail = function() {
      $location.url("/patient/detail/" + $scope.patientUUID); // path not hash
    };

    $scope.getAlerts = function () {
      alertService.get($scope.patientUUID).success(function (data) {
        $scope.flags = data.flags;
      });
    };
  }

})();

