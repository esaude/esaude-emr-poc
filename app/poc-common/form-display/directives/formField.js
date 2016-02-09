'use strict';

angular.module('poc.common.formdisplay')
    .directive('formField', function () {
        
        return {
            restrict: 'AE',
            templateUrl: ' ../poc-common/form-display/views/formField.html',
            controller: 'FormFieldDirectiveController',
            scope: {
                formParts: '=',
                fieldUuid: '=',
                fieldId: '='
            }
        };
    })
    .controller('FormFieldDirectiveController', function ($scope) {
        (function () {
            
        })();
    });
