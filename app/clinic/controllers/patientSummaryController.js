'use strict';

angular.module('clinic')
        .controller('PatientSummaryController', ["$scope", "$rootScope", "$stateParams",
                        "encounterService", "observationsService", "commonService",
                    function ($scope, $rootScope, $stateParams, encounterService,
                    observationsService, commonService) {
        var patientUuid;

        (function () {
            patientUuid = $stateParams.patientUuid;
        })();

        $scope.initVisitHistory = function () {
            encounterService.getEncountersOfPatient(patientUuid).success(function (data) {
                $scope.visits = commonService.filterGroupReverse(data);
            });
        };

        $scope.initLabResults = function () {
            var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid).success(function (data) {
                $scope.labs = commonService.filterGroupReverse(data);
            });
        };

        $scope.initDiagnosis = function () {
            var concepts = ["e1cdd38c-1d5f-11e0-b929-000c29ad1d07",
                "e1e2b07c-1d5f-11e0-b929-000c29ad1d07",
                "e1d608cc-1d5f-11e0-b929-000c29ad1d07",
                "e1e5232a-1d5f-11e0-b929-000c29ad1d07",
                "e1e529a6-1d5f-11e0-b929-000c29ad1d07",
                "e1d2984a-1d5f-11e0-b929-000c29ad1d07",
                "e1dac2ae-1d5f-11e0-b929-000c29ad1d07",
                "e1dac3da-1d5f-11e0-b929-000c29ad1d07",
                "e1dac574-1d5f-11e0-b929-000c29ad1d07",
                "e1e2530c-1d5f-11e0-b929-000c29ad1d07",
                "e1e52898-1d5f-11e0-b929-000c29ad1d07",
                "e1e29fa6-1d5f-11e0-b929-000c29ad1d07",
                "e1daf922-1d5f-11e0-b929-000c29ad1d07",
                "e1dce93a-1d5f-11e0-b929-000c29ad1d07"
            ];//TODO: create in configuration file

            observationsService.findAll(patientUuid).success (function (data) {
                var filtered = observationsService.filterByList(data.results, concepts);//TODO: filter must be dome in backend system
              $scope.diagnosis = _.sortBy(filtered, function (obs) {
                  return obs.obsDatetime;
                });
            });
        };

        $scope.initPharmacyPickups = function () {
            var pharmacyEncounterUuid = "e279133c-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            encounterService.getEncountersForEncounterType(patientUuid, pharmacyEncounterUuid).success(function (data) {
                $scope.pickups = commonService.filterGroupReverse(data);
            });
        };

        $scope.initPrescriptions = function () {
            var concepts = ["e1d83d4a-1d5f-11e0-b929-000c29ad1d07",
                "e1d9ee10-1d5f-11e0-b929-000c29ad1d07",
                "e1d9ead2-1d5f-11e0-b929-000c29ad1d07",
                "e1de8862-1d5f-11e0-b929-000c29ad1d07"
            ];//TODO: create in configuration file

            var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            var patient = commonService.deferPatient($rootScope.patient);

            encounterService.getEncountersForEncounterType(patient.uuid,
            (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                    .success(function (data) {
                        $scope.prescriptions = commonService.filterGroupReverseFollowupObs(concepts, data.results);

            });
        };

        $scope.initAllergies = function () {
            var concepts = ["e1e07ece-1d5f-11e0-b929-000c29ad1d07", "e1da757e-1d5f-11e0-b929-000c29ad1d07"];

            var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            var patient = commonService.deferPatient($rootScope.patient);

            encounterService.getEncountersForEncounterType(patient.uuid,
            (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                    .success(function (data) {
                        $scope.allergies = commonService.filterGroupReverseFollowupObs(concepts, data.results);

            });
        };

        $scope.initVitals = function () {
            var concepts = ["e1e2e934-1d5f-11e0-b929-000c29ad1d07",
                "e1e2e826-1d5f-11e0-b929-000c29ad1d07",
                "e1da52ba-1d5f-11e0-b929-000c29ad1d07",
                "e1e2e70e-1d5f-11e0-b929-000c29ad1d07",
                "e1e2e3d0-1d5f-11e0-b929-000c29ad1d07"
            ];//TODO: create in configuration file

            var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            var patient = commonService.deferPatient($rootScope.patient);

            encounterService.getEncountersForEncounterType(patient.uuid,
            (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                    .success(function (data) {
                        $scope.vitals = commonService.filterGroupReverseFollowupObs(concepts, data.results);

            });
        };

        $scope.isObject = function (value) {
            return _.isObject(value);
        };
    }]);
