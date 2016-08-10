'use strict';

angular.module('poc.common.clinicalservices')
    .directive('clinicalService', function () {
        
        var link = function (scope, element, atts, ctrl) {
            
        };
        
        return {
            link: link,
            restrict: 'AE',
            templateUrl: ' ../poc-common/clinical-services/views/clinicalService.html',
            controller: 'ClinicalServiceDirectiveController',
            scope: {
                patientUuid: '=',
                encounteDatetime: '=',
                services: '='
            }
        };
    })
    .controller('ClinicalServiceDirectiveController', ['$scope', 'encounterService', 'patientService', 'openmrsPatientMapper', 
                function ($scope, encounterService, patientService, patientMapper) {

        
        var dateUtil = Bahmni.Common.Util.DateUtil;
        
        (function () {
            patientService.get($scope.patientUuid).success(function (data) {
                $scope.patient = patientMapper.map(data);
            });
            
        })();

        $scope.initService = function (service) {
            var formPayload = $scope.$parent.serviceForms[service.id];
        
            encounterService.getEncountersForEncounterType($scope.patientUuid, formPayload.encounterType.uuid)
                    .success(function (data) {
                        var nonVoidedEncounters = encounterService.filterRetiredEncoounters(data.results);
                        var sortedEncounters = _.sortBy(nonVoidedEncounters, function (encounter) {
                            return moment(encounter.encounterDatetime).toDate();
                        }).reverse();
                        service.encountersForService = sortedEncounters;
                        service.lastEncounterForService = sortedEncounters[0];
                        service.hasEntryToday = false;
                        if ($scope.$parent.todayVisit && service.lastEncounterForService) {
                            service.hasEntryToday = (dateUtil.diffInDaysRegardlessOfTime($scope.$parent.todayVisit.startDatetime, 
                                        service.lastEncounterForService.encounterDatetime) === 0) ? true : false;
                        }
                        service.list = false;
            });
            checkContraints(service);
        };
        
        var checkContraints = function (service) {
            service.showService = true;
            
            if (service.constraints.requireChekin) {
                if ($scope.$parent.hasVisitToday) {
                    service.showService = true;
                } else {
                    service.showService = false;
                }
            }
            
            if (service.constraints.minAge && 
                    $scope.$parent.patient.age.years < service.constraints.minAge) {
                service.showService = false;
            }
            
            if (service.constraints.maxAge && 
                    $scope.$parent.patient.age.years > service.constraints.maxAge) {
                service.showService = false;
            }
            
        };
        
        $scope.checkRestrictionsToAdd = function (service) {
            var canAdd;
            if (service.maxOccur < 0 || service.encountersForService.length < service.maxOccur) {
                canAdd = true;
                if (service.hasEntryToday) {
                    canAdd = false;
                }
            }
            return canAdd;
        };
        
        $scope.linkAdd = function (service) {
            $scope.$parent.linkServiceAdd(service);
        };
        
        $scope.linkEdit = function (service, encounter) {
            $scope.$parent.linkServiceEdit(service, encounter);
        };
        
        $scope.list = function (service) {
            (service.list) ? service.list = false : service.list = true;
        };
        
        $scope.removeEncounter = function (encounter) {
            (typeof encounter.delete === 'undefined' || encounter.delete === false) ? 
            encounter.delete = true : encounter.delete = false;
        };
    }]);
