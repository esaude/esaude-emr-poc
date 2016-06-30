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

        $scope.stringToJson = function (str) {
            return JSON.parse(str);
        };
        
        $scope.getFieldValidity = function (fieldUuid) {
            return $scope.$parent.visitedFields[fieldUuid];
        };
        
        $scope.isTrueFalseQuestion = function (question) {
            var found = _.find(question, function (answer) {
                return answer.uuid === "e1d81b62-1d5f-11e0-b929-000c29ad1d07" || 
                        answer.uuid === "e1d81c70-1d5f-11e0-b929-000c29ad1d07";
            });
            return typeof found !== "undefined";
        };
    });
