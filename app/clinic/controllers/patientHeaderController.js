'use strict';

angular.module('clinic')
  .controller('PatientHeaderController', ["$rootScope", "$scope", "$filter", "$stateParams", "patientService", "encounterService", "observationsService", "commonService",
    function ($rootScope, $scope, $filter, $stateParams, patientService, encounterService, observationsService, commonService) {
      var patientUuid;

      (function () {
        patientUuid = $stateParams.patientUuid;
      })();

      var patientPrescriptions = [];

      //TODO: Add patientState Tests, fix followup refresh scope issue
      $scope.initPatientState = function () {
        var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";
        var conceptsLabs = ["e1e68f26-1d5f-11e0-b929-000c29ad1d07",
          "e1d6247e-1d5f-11e0-b929-000c29ad1d07"];

        var seriesLabs = [$filter('translate')('CLINIC_PATIENT_CD4_COUNT'),
          $filter('translate')('CLINIC_PATIENT_HIV_VIRAL_LOAD')];
        var name = "labResults";

        encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid)
          .success(function (data) {
            var filteredLabs = filterObs(data, conceptsLabs, seriesLabs, name);
            $scope.patientStates = createStateData(filteredLabs, conceptsLabs, seriesLabs, name);
          });

        //TODO: Fix concept translation reference and synonyms, answers
        var conceptsTreatment = ["e1d9f7a2-1d5f-11e0-b929-000c29ad1d07",
          "e1d9ee10-1d5f-11e0-b929-000c29ad1d07",
          "e1d9ead2-1d5f-11e0-b929-000c29ad1d07",
          "e1de8862-1d5f-11e0-b929-000c29ad1d07",
          "e1d85906-1d5f-11e0-b929-000c29ad1d07",
          "e2404d72-1d5f-11e0-b929-000c29ad1d07",
          "e1d9ef28-1d5f-11e0-b929-000c29ad1d07",
          "e1d83e4e-1d5f-11e0-b929-000c29ad1d07"];

        var seriesFollowUp = [$filter('translate')('TUBERCULOSIS_PROPHYLAXIS_STARTED'),
          $filter('translate')('ANTIRETROVIRAL PLAN'),
          $filter('translate')('HISTORICAL_DRUG_START_DATE'),
          $filter('translate')('TUBERCULOSIS_DRUG_TREATMENT_START_DATE'),
          $filter('translate')('TUBERCULOSIS_DRUG_TREATMENT_START_DATE'),
          $filter('translate')('ANTIRETROVIRAL_PLAN'),
          $filter('translate')('REGIMEN')];

        var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
        var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

        var patient = commonService.deferPatient($rootScope.patient);
        var patientPrescriptions = [];

        encounterService.getEncountersForEncounterType(patient.uuid,
          (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
          .success(function (data) {
            patientPrescriptions = commonService.filterGroupReverseFollowupObs("e1d9ef28-1d5f-11e0-b929-000c29ad1d07", data.results);

            var filteredFollowup = filterObs(data, conceptsTreatment, seriesFollowUp, "followUp");
            var encounterType = ((patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid);
            $scope.patientFollowups = createStateData(filteredFollowup, conceptsTreatment, seriesFollowUp, "followUp");


            $scope.patientPrescriptions = patientPrescriptions[0];
          });
      };

      var filterObs = function (data, concepts) {

        var nonRetired = encounterService.filterRetiredEncoounters(data.results);

        var sliced = _.slice(nonRetired, 0, 9);

        _.forEach(sliced, function (encounter) {
          encounter.obs = observationsService.filterByList(encounter.obs, concepts);
        });
        var filtered = _.filter(sliced, function (encounter) {
          return !_.isEmpty(encounter.obs);
        });

        return filtered;
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
        var lastDate = $scope[state + "dates"].length - 1;
        $scope.labDate = $scope[state + "dates"][lastDate];
        $scope[state + "Data"] = data;
        var lastObs = (data.length) - 1;

        angular.forEach(seriesLabs, function (value, key) {
          var exam = value;
          var result = data[key][lastObs];
          var state = {"exam": exam, "result": result};
          patientStates.push(state);
        });

        return patientStates;
      }
    }
  ]);
