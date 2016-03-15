'use strict';

angular.module('clinic')
        .controller('PatientSummaryController', ["$scope", "$location", "$stateParams", 
                        "encounterService", "observationsService", "patientService", "openmrsPatientMapper",
                    function ($scope, $location, $stateParams, encounterService, 
                    observationsService, patientService, patientMapper) {
        var patientUuid;

        (function () {
            patientUuid = $stateParams.patientUuid;
            
            patientService.get(patientUuid).success(function (data) {
                $scope.patient = patientMapper.map(data);
            });
        })();
        
        var filterGroupReverse = function (data, element) {
            var nonRetired = encounterService.filterRetiredEncoounters(data.results);
            var grouped = _.groupBy(nonRetired, function (element) {
                return Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime);
            });
            var reversed = _.values(grouped).reverse();
            $scope[element] = reversed;
        };
        
        var filterGroupReverseObs = function (concepts, element) {
            var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            
            encounterService.getEncountersForEncounterType(patientUuid, 
            ($scope.patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                    .success(function (data) {
                var nonRetired = encounterService.filterRetiredEncoounters(data.results);
                _.forEach(nonRetired, function (encounter) {
                    encounter.obs = observationsService.filterByList(encounter.obs, concepts);
                });
                var filtered = _.filter(nonRetired, function (encounter) {
                    return !_.isEmpty(encounter.obs);
                });
                $scope[element] = filtered.reverse();
            });
        }
        
        $scope.initVisitHistory = function () {
            encounterService.getEncountersOfPatient(patientUuid).success(function (data) {
                filterGroupReverse(data, "visits");
            });
        };
        
        $scope.initLabResults = function () {
            var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            
            encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid).success(function (data) {
                filterGroupReverse(data, "labs");
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
                var ordered = _.sortBy(filtered, function (obs) {
                    return obs.obsDatetime;
                });
                $scope.diagnosis = ordered;
            });
        };
        
        $scope.initPharmacyPickups = function () {
            var pharmacyEncounterUuid = "e279133c-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            
            encounterService.getEncountersForEncounterType(patientUuid, pharmacyEncounterUuid).success(function (data) {
                filterGroupReverse(data, "pickups");
            });
        };
        
        $scope.initPrescriptions = function () {      
            var concepts = ["e1d83d4a-1d5f-11e0-b929-000c29ad1d07", 
                "e1d9ee10-1d5f-11e0-b929-000c29ad1d07",
                "e1d9ead2-1d5f-11e0-b929-000c29ad1d07",
                "e1de8862-1d5f-11e0-b929-000c29ad1d07"
            ];//TODO: create in configuration file         
            filterGroupReverseObs(concepts, "prescriptions");
        };
        
        $scope.initAllergies = function () { 
            var concepts = ["e1e07ece-1d5f-11e0-b929-000c29ad1d07", "e1da757e-1d5f-11e0-b929-000c29ad1d07"];          
            filterGroupReverseObs(concepts, "allergies");
        };
        
        $scope.initVitals = function () {          
            var concepts = ["e1e2e934-1d5f-11e0-b929-000c29ad1d07", 
                "e1e2e826-1d5f-11e0-b929-000c29ad1d07",
                "e1da52ba-1d5f-11e0-b929-000c29ad1d07",
                "e1e2e70e-1d5f-11e0-b929-000c29ad1d07",
                "e1e2e3d0-1d5f-11e0-b929-000c29ad1d07"
            ];//TODO: create in configuration file
            filterGroupReverseObs(concepts, "vitals");
        };
        
        $scope.isObject = function (value) {
            return _.isObject(value);
        };
    }]);
