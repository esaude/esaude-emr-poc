(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientSearch', {
      bindToController: true,
      controller: PatientSearchController,
      controllerAs: 'vm',
      bindings: {
        showSchedule: '<',
        scheduleType: '<',
        createPatient: '<'
      },
      templateUrl: '../common/patient/components/patientSearch.html'
    });

  PatientSearchController.$inject = ['$location', '$rootScope', '$state', 'commonService', 'observationsService',
    'openmrsPatientMapper', 'patientService',  'visitService'];

  /* @ngInject */
  function PatientSearchController($location, $rootScope, $state, commonService, observationsService,
                                   openmrsPatientMapper, patientService) {

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
    vm.onPatientSelect = onPatientSelect;

    ////////////////

    function change() {
      if (vm.searchText.trim().length <= 0) {
        return;
      }

      patientService.search(vm.searchText).then(function (patients) {
        vm.results = mapPatient(patients);
        vm.displayed = vm.results;
        vm.noResultsMessage = vm.results.length === 0 ? "SEARCH_PATIENT_NO_RESULT" : null;
        findLastDateOfNextConsultation();
      });
    }

    function barcodeHandler(code) {
      //replace any special char by "/"
      var cleanCode = code.replace(/[^\w\s]/gi, '/');
      var nidRegex = new RegExp("[0-9]{8}/[0-9]{2}/[0-9]{5}");
      if (!nidRegex.test(cleanCode)) {
        notifier.information($filter('translate')('SEARCH_PATIENT_NO_RESULT'));
        return;
      }

      patientService.search(cleanCode).then(function (patients) {
        if (patients.length !== 1) {
          notifier.information($filter('translate')('SEARCH_PATIENT_NO_RESULT'));
          return;
        }
        var patient = openmrsPatientMapper.map(patients[0]);
        
        // Auto select the patient if the attribute is set
        if(angular.element('barcode-listener').data('auto-select'))
          vm.onPatientSelect(patient);
      }).error(function (data) {
        vm.noResultsMessage = "SEARCH_PATIENT_NO_RESULT";
      });

    }

    function linkDashboard(patient) {
      $state.go('dashboard', {patientUuid: patient.uuid});
    }

    function linkPatientNew() {
      $state.go('newpatient.identifier');
    }

    function onPatientSelect(patient) {
      $state.go('dashboard', {patientUuid: patient.uuid});
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
