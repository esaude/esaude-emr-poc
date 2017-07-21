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
    .controller('FieldReadDirectiveController', function ($scope, $rootScope) {
        (function () {
        })();

        $scope.stringToJson = function (str) {

            if (str !== undefined) {
                return JSON.parse(str);
            }
            return undefined;
          
        };
        
        $scope.getFieldValidity = function (fieldUuid) {
            if ($rootScope.postAction === "display") {
                return {
                        uuid: fieldUuid,
                        valid: true
                    };;
            }

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
