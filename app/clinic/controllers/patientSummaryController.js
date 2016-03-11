'use strict';

angular.module('clinic')
        .controller('PatientSummaryController', ["$scope", "$location", "$stateParams", "encounterService", 
                    function ($scope, $location, $stateParams, encounterService) {
        var patientUuid;

        (function () {
            patientUuid = $stateParams.patientUuid;
        })();
        
        $scope.initVisitHistory = function () {
            encounterService.getEncountersOfPatient(patientUuid).success(function (data) {
                var nonRetired = encounterService.filterRetiredEncoounters(data.results);
                var grouped = _.groupBy(nonRetired, function (element) {
                    return Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime);
                });
                var reversed = _.values(grouped).reverse();
                $scope.visits = reversed;
            });
        };
        
        $scope.initLabResults = function () {
            var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            
            encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid).success(function (data) {
                var nonRetired = encounterService.filterRetiredEncoounters(data.results);
                var grouped = _.groupBy(nonRetired, function (element) {
                    return Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime);
                });
                var reversed = _.values(grouped).reverse();
                $scope.labs = reversed;
                console.log(reversed);
            });
        };
        
        $scope.isObject = function (value) {
            return _.isObject(value);
        }

    }]);
