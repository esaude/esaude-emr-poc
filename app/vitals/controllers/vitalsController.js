'use strict';

angular.module('vitals')
        .controller('VitalsController', ['$rootScope', '$scope', '$stateParams', 'visitService', 'observationsService',
                    function ($rootScope, $scope, $stateParams, visitService, observationsService) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
                
                visitService.search({patient: patientUuid, 
                    v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'})
                .success(function (data) {          
                    $scope.lastVisit = _.maxBy(data.results, 'startDatetime');
                });
                
                observationsService.get(patientUuid, 'e1e2e934-1d5f-11e0-b929-000c29ad1d07').success(function (data) {
                    var nonRetired = observationsService.filterRetiredObs(data.results);
                    $scope.lastHeight = _.maxBy(nonRetired, 'obsDatetime');
                });
                
                observationsService.get(patientUuid, 'e1da52ba-1d5f-11e0-b929-000c29ad1d07').success(function (data) {
                    var nonRetired = observationsService.filterRetiredObs(data.results);
                    $scope.lastBmi = _.maxBy(nonRetired, 'obsDatetime');
                });
            }
        }]);
