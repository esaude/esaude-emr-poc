(function () {
  'use strict';

  angular
    .module('common.patient')
    .directive('patientSearch', patientSearch)
    .controller('PatientSearchController', PatientSearchController);

  patientSearch.$inject = [];

  /* @ngInject */
  function patientSearch() {
    var directive = {
      bindToController: true,
      controller: PatientSearchController,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        showSchedule: '=',
        scheduleType: '='
      },
      templateUrl: '../common/patient/directives/patientSearch.html'
    };
    return directive;
  }

  PatientSearchController.$inject = ['$location', '$rootScope', 'commonService', 'observationsService',
    'openmrsPatientMapper', 'patientService', 'spinner', 'visitService'];

  /* @ngInject */
  function PatientSearchController($location, $rootScope, commonService, observationsService,
                                   openmrsPatientMapper, patientService, spinner, visitService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var vm = this;
    vm.displayed = [];
    vm.noResultsMessage = 'SEARCH_PATIENT_NO_RESULT';
    vm.results = [];
    vm.searchText = '';

    vm.barcodeHandler = barcodeHandler;
    vm.change = change;
    vm.linkDashboard = linkDashboard;
    vm.linkPatientNew = linkPatientNew;

    activate();

    ////////////////

    function activate() {

    }

    function change() {
      if (vm.searchText.trim().length <= 0) {
        return;
      }

      var search = patientService.search(vm.searchText).then(function (patients) {
        vm.results = mapPatient(patients);
        vm.displayed = vm.results;
        vm.noResultsMessage = vm.results.length === 0 ? "SEARCH_PATIENT_NO_RESULT" : null;
        findLastDateOfNextConsultation();
      });

      spinner.forPromise(search);
    }

    function barcodeHandler(code) {
      //replace any special char by "/"
      var cleanCode = code.replace(/[^\w\s]/gi, '/');
      var nidRegex = new RegExp("[0-9]{8}/[0-9]{2}/[0-9]{5}");
      if (!nidRegex.test(cleanCode)) {
        notifier.information($filter('translate')('SEARCH_PATIENT_NO_RESULT'));
        return;
      }

      spinner.forPromise(patientService.search(cleanCode).then(function (patients) {
        if (patients.length !== 1) {
          notifier.information($filter('translate')('SEARCH_PATIENT_NO_RESULT'));
          return;
        }
        var patient = openmrsPatientMapper.map(patients[0]);
        $rootScope.patient = patient;
        redirectToPage(patient);
      }).error(function (data) {
        vm.noResultsMessage = "SEARCH_PATIENT_NO_RESULT";
      }));

    }

    function linkDashboard(patient) {
      if (patient.age) {
        $rootScope.patient = patient;
        redirectToPage(patient);
      } else {
        patientService.getPatient(patient.uuid).then(function (patient) {
          $rootScope.patient = patient;
          redirectToPage(patient);
        });
      }
    }

    function redirectToPage(patient) {
      //initialize visit info in scope
      visitService.search({patient: patient.uuid, v: "full"})
        .then(function (visits) {
          var nonRetired = commonService.filterRetired(visits);
          //in case the patient has an active visit
          if (!_.isEmpty(nonRetired)) {
            var lastVisit = _.maxBy(nonRetired, 'startDatetime');
            var now = dateUtil.now();
            //is last visit todays
            if (dateUtil.parseDatetime(lastVisit.startDatetime) <= now &&
              dateUtil.parseDatetime(lastVisit.stopDatetime) >= now) {
              $rootScope.hasVisitToday = true;
              $rootScope.todayVisit = lastVisit;
            } else {
              $rootScope.hasVisitToday = false;
            }
          }

          $location.url(eval($rootScope.landingPageAfterSearch)); // path not hash
        });
    }

    function linkPatientNew() {
      $location.url("/patient/new/identifier"); // path not hash
    }

    function mapPatient(results) {
      //prepare results to be presented in search table
      var preparedResults = [];
      for (var patientIndex in results) {
        var result = results[patientIndex];
        var patient = openmrsPatientMapper.map(result);

        preparedResults.push(patient);
      }
      preparedResults = _.sortBy(preparedResults, ['givenName', 'familyName']);
      return preparedResults;
    }

    function findLastDateOfNextConsultation() {
      _.forEach(vm.results, function (result) {
        observationsService.getObs(result.uuid, 'e1dae630-1d5f-11e0-b929-000c29ad1d07')
          .then(function (obs) {
            //skip if doesn't have next consultation
            if (_.isEmpty(obs)) return;

            var nonRetired = commonService.filterRetired(obs);
            var maxResult = _.maxBy(nonRetired, 'encounter.encounterDatetime');
            //check if past, current or future schedule
            var now = dateUtil.now();
            var dateDiff = dateUtil.diffInDaysRegardlessOfTime(now, maxResult.value);
            result.nextConsultation = maxResult.value;
            if (dateDiff < 0) {
              result.scheduledTo = "P";
            }
            else if (dateDiff > 0) {
              result.scheduledTo = "F";
            } else {
              result.scheduledTo = "A";
            }
          });
      });
    }

  }

})();
