'use strict';

angular.module('poc.common.formdisplay')
    .directive('formField', function () {
        
        var link = function (scope, element, atts, ctrl) {
//            console.log(ctrl.submitted)
//            scope.$watch('scope.$parent.submitted', function (validity) {
//                console.log(validity);
//            });
        };
        
        return {
            link: link,
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
