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
    .controller('ClinicalServiceDirectiveController', function ($scope) {
        debugger
        (function () {
            
        })();
        
        $scope.link = function (service) {
            $scope.$parent.linkService(service);
        };
    });
