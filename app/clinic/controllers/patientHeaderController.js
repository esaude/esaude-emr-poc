'use strict';

angular.module('clinic')
  .controller('PatientHeaderController', ["$rootScope", "$scope", "$filter", "$stateParams", "patientService", "encounterService", "observationsService", "commonService",
    function ($rootScope, $scope, $filter, $stateParams, patientService, encounterService, observationsService, commonService) {
      var patientUuid;


      (function () {
        patientUuid = $stateParams.patientUuid;
      })();
      var patientPrescriptions = [];
      initPatientState();

      //TODO: Add patientState Tests, fix followup refresh scope issue
      function initPatientState() {
        var labEncounterUuid = Bahmni.Common.Constants.labEncounterUuid;
        var conceptsLabs = ["e1e68f26-1d5f-11e0-b929-000c29ad1d07",
          "e1d6247e-1d5f-11e0-b929-000c29ad1d07",
          "e1da52ba-1d5f-11e0-b929-000c29ad1d07"
        ];

        var seriesLabs = [
          $filter('translate')('CLINIC_PATIENT_CD4_COUNT'),
          $filter('translate')('CLINIC_PATIENT_HIV_VIRAL_LOAD'),
          $filter('translate')('CLINIC_PATIENT_BMI')
        ];
        var name = "labResults";

        encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid, "default")
          .success(function (data) {

            if (data.results.length != 0) {
              var filteredLabs = filterObs(data, conceptsLabs, seriesLabs, name);
              $scope.patientStates = createStateData(filteredLabs, conceptsLabs, seriesLabs, name);
            } else {
              $scope.nopatientState = "CLINICAL_OBSERVATIONS_INFO_EMPTY";
            }
          });

        //TODO: Fix concept translation reference and synonyms, answers
        var conceptsTreatment = [
          "e1e53c02-1d5f-11e0-b929-000c29ad1d07",
          "e1d9fbda-1d5f-11e0-b929-000c29ad1d07",
          "e1d83d4a-1d5f-11e0-b929-000c29ad1d07",
          "e1da52ba-1d5f-11e0-b929-000c29ad1d07"
        ];

        var seriesFollowUp = [
          $filter('translate')('CURRENT_WHO_HIV_STAGE'),
          $filter('translate')('TUBERCULOSIS_TREATMENT_PLAN'),
          $filter('translate')('PREVIOUS_ANTIRETROVIRAL_DRUGS_USED_FOR_TREATMENT'),
          $filter('translate')('CLINIC_PATIENT_BMI')
        ];

        var adultFollowupEncounterUuid = Bahmni.Common.Constants.adultFollowupEncounterUuid;
        var childFollowupEncounterUuid = Bahmni.Common.Constants.childFollowupEncounterUuid;

        patientService.getPatient(patientUuid).then(function (patient) {
          encounterService.getEncountersForEncounterType(patient.uuid,
          (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid, "default")
          .success(function (data) {
            patientPrescriptions = commonService.filterGroupReverseFollowupObs(conceptsTreatment, data.results);

            if (patientPrescriptions.length != 0) {
              $scope.patientPrescription = filterObs(data, conceptsTreatment, seriesFollowUp, "followUp");
            } else {
              $scope.noWHOStage = "CLINICAL_WHO_STAGE_EMPTY";
            }
            //TODO: Add infant and pregnant women
          });
        });
      };

      var filterObs = function (data, concepts) {

        var nonRetired = encounterService.filterRetiredEncoounters(data.results);

        var sliced = _.slice(nonRetired, 0, 9);

        _.forEach(sliced, function (encounter) {
          encounter.obs = observationsService.filterByList(encounter.obs, concepts);
        });
        return _.filter(sliced, function (encounter) {
          return !_.isEmpty(encounter.obs);
        });
      };

      var createStateData = function (encounters, concepts, seriesLabs, state) {
        var patientStates = [];
        $scope[state + "dates"] = [];
        $scope[state + "seriesLabs"] = seriesLabs;
        var data = [];

        _.forEach(encounters, function (encounter) {
          $scope[state + "dates"].push($filter('date')(encounter.encounterDatetime, "MMM d, y"));
          _.forEach(concepts, function (concept, key) {
            var found = _.find(encounter.obs, function (obs) {
              return obs.concept.uuid === concept;
            });
            if (typeof data[key] === 'undefined') data[key] = [];
            data[key].push((found) ? found.value : null);
          });
        });

        var datesArraySize = $scope[state + "dates"].length;
        var lastDate = 0;
        if (datesArraySize != 0)
          lastDate = datesArraySize - 1;

        $scope.labDate = $scope[state + "dates"][lastDate];
        $scope[state + "Data"] = data;

        var obsArraySize = data[0].length;
        var lastObs = 0;
        if (obsArraySize != 0) {
          lastObs = obsArraySize - 1;
          angular.forEach(seriesLabs, function (value, key) {
            var exam = value;
            var result = data[key][lastObs];
            var state = {"exam": exam, "result": result};
            patientStates.push(state);
          });
        }
        return patientStates;
      }
    }
  ]);
