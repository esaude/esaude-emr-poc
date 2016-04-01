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
        (function () {
            patientService.get($scope.patientUuid).success(function (data) {
                $scope.patient = patientMapper.map(data);
            });
            
        })();

        $scope.initService = function (service) {
            var formPayload = $scope.$parent.serviceForms[service.formId];
            
            encounterService.getEncountersForEncounterType($scope.patientUuid, formPayload.encounterType.uuid)
                    .success(function (data) {
                        var nonVoidedEncounters = encounterService.filterRetiredEncoounters(data.results);
                        var sortedEncounters = _.sortBy(nonVoidedEncounters, function (encounter) {
                            return moment(encounter.encounterDatetime).toDate();
                        }).reverse();
                        service.encountersForService = sortedEncounters;
                        service.lastEncounterForService = sortedEncounters[0];
                        service.list = false;
                    });
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
