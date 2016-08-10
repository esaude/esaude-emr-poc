'use strict';

angular.module('clinic')
        .controller('PatientActualController', ["$scope", "$rootScope", "$stateParams", 
                        "encounterService", "observationsService", "commonService",
                    function ($scope, $rootScope, $stateParams, encounterService, 
                    observationsService, commonService) {
        var patientUuid;

        (function () {
            patientUuid = $stateParams.patientUuid;
        })();
        
        $scope.initMaxLabResults = function () {
            var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            
            encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid).success(function (data) {
                var labs = commonService.filterGroupReverse(data);
                if(!_.isEmpty(labs)) {
                    $scope.maxLab = _.maxBy(labs[0], 'encounterDatetime');
                }
            });
        };
    }]);
