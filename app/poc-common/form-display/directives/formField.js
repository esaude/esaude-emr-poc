'use strict';

angular.module('poc.common.formdisplay')
    .directive('formField', function () {
        
        var link = function (scope, element, atts, ctrl) {
            
        };
        
        return {
            link: link,
            restrict: 'AE',
            templateUrl: ' ../poc-common/form-display/views/formField.html',
            controller: 'FormFieldDirectiveController',
            scope: {
                field: '=',
                formParts: '=',
                fieldUuid: '=',
                fieldId: '='
            }
        };
    })
    .controller('FormFieldDirectiveController', ['$rootScope', '$scope', 'observationsService', function ($rootScope, 
        $scope, observationsService) {
            
        var formLogic = {};
        
        formLogic.defaultValueIsLastEntry = function (param) {
            observationsService.get($rootScope.patient.uuid, param).success(function (data) {
                var nonRetired = observationsService.filterRetiredObs(data.results);
                if (!_.isEmpty(nonRetired)) {
                    var last = _.maxBy(nonRetired, 'obsDatetime');
                    $scope.fieldModel.value = last.value;
                }
            });
        };
        
        formLogic.calculateOnChange = function (param) {
            $scope.$watch('fieldModel.value', function (value) {
                alert(value);
            });
        };
        
        formLogic.calculateWithLastObs = function (param) {
            var tokens = _.split(param, ',');
            var formula = "";
            //find uuid and replace by value
            _.forEach(tokens, function (token) {
                if(validator.isUUID(token)) {
                    observationsService.get($rootScope.patient.uuid, token).success(function (data) {
                        var nonRetired = observationsService.filterRetiredObs(data.results);
                        if (!_.isEmpty(nonRetired)) {
                            var last = _.maxBy(nonRetired, 'obsDatetime');
                            token = last.value;
                            debugger
                        }
                    });
                }
                formula += token;
            });
            $scope.fieldModel.value = eval(formula);
        };
            
        (function () {
            $scope.$watch('$parent.submitted', function (value) {
                $scope.showMessages = value;
            });
            
            $scope.$watch('aForm.' + $scope.fieldId + '.$valid', function (value) {
                if (typeof value !== "undefined") {
                    $scope.$parent.visitedFields[$scope.fieldUuid] = {
                        uuid: $scope.fieldUuid,
                        valid: value
                    };
                }
            });
            
            $scope.initFieldModel = function () {
                $scope.fieldModel = $scope.formParts.form.fields[$scope.fieldUuid];
                if(!$scope.fieldModel.value) {
                    _.forEach($scope.field.logics, function (param, name) {
                        formLogic[name](param);
                    });
                }
            };
            
        })();
        
        var compactName = function (name) {
            return name.trim().replace(/[^a-zA-Z0-9]/g, '');
        };
    }]);
