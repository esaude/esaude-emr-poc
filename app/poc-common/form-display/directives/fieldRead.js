'use strict';

angular.module('poc.common.formdisplay')
    .directive('fieldRead', function () {
        
        return {
            restrict: 'AE',
            templateUrl: ' ../poc-common/form-display/views/fieldRead.html',
            controller: 'FieldReadDirectiveController',
            scope: {
                payload: '=',
                formPart: '='
            }
        };
    })
    .controller('FieldReadDirectiveController', function ($scope) {
        (function () {
            
        })();
    });
