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
    .controller('FormFieldDirectiveController', ['$http', '$rootScope', '$scope', 'observationsService', '$filter', function ($http, $rootScope,
        $scope, observationsService, $filter) {

        var formLogic = {};

        var fireHideEvent = function (event) {
            $scope.$watch('aForm.' + $scope.fieldId + '.$viewValue', function (newVal, oldVal) {
                if (newVal !== oldVal && !_.isUndefined(oldVal)) {
                    $rootScope.$broadcast(event, newVal);
                }
            });
        };

        var listenHideEvent = function (event) {
            $scope.$on(event, function (event, val) {
                var valJson = JSON.parse(val);
                if (valJson.uuid === "e1d81b62-1d5f-11e0-b929-000c29ad1d07") {
                    $scope.field.hidden = false;
                    $rootScope.formPayload.form.fields[event.currentScope.fieldUuid].field.required = true;


                } else {
                    $scope.field.hidden = true;
                    $rootScope.formPayload.form.fields[event.currentScope.fieldUuid].field.required = false;
                }
            });
        };

        var dateController = function (param) {
            $scope.$watch('aForm.' + $scope.fieldId + '.$viewValue', function (newVal, oldVal) {
                var dateUtil = Bahmni.Common.Util.DateUtil

                var startDate = $rootScope.formPayload.form.fields[param].value
                var _date = dateUtil.getDateWithoutTime(startDate);
                var date = dateUtil.getDateWithoutTime(new Date());
                var _dateu = dateUtil.getDateWithoutTime(newVal);

                if (newVal !== oldVal && !_.isUndefined(newVal)) {
                    if (_dateu > _date) {
                        $scope.validDate = false;
                    } else {
                        $scope.fieldModel.value = "";
                        $scope.validDate = true;

                    }
                }
            });
        };

        formLogic.defaultValueIsLastEntry = function (param) {
            observationsService.get($rootScope.patient.uuid, param).success(function (data) {
                var nonRetired = observationsService.filterRetiredObs(data.results);

                if (!_.isEmpty(nonRetired)) {
                    var last = _.maxBy(nonRetired, 'obsDatetime');

                    if (last.value.datatype && last.value.datatype.display === "Coded") {
                        $scope.fieldModel.value = realValueOfField($scope.fieldModel.fieldConcept.concept.answers, last.value);
                        return;

                    }
                    $scope.fieldModel.value = last.value;
                }
            });
        };

        formLogic.calculateOnChange = function (param) {};

        formLogic.calculateWithLastObs = function (param) {};

        (function () {
            $scope.$watch('$parent.submitted', function (value) {
                $scope.showMessages = value;
            });
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

            if ($scope.field.fireHideEvent) {
                fireHideEvent($scope.field.fireHideEvent);
            }

            if ($scope.field.listenHideEvent) {
                listenHideEvent($scope.field.listenHideEvent);
            }

            if ($scope.field.dateController) {
                dateController($scope.field.dateController);
            }

            $scope.initFieldModel = function () {
                $scope.fieldModel = $scope.formParts.form.fields[$scope.fieldUuid];

                if (!$scope.fieldModel.value) {
                    loadField()
                }

                if ($scope.fieldModel.field.uuid === whoCurrentStageuuId) {
                    loadField();
                }
            };

        })();

        var whoCurrentStageuuId = "e27ffd6e-1d5f-11e0-b929-000c29ad1d07";

        var loadField = function () {
            _.forEach($scope.field.logics, function (param, name) {
                formLogic[name](param);
            });
        }

        $scope.isTrueFalseQuestion = function (question) {
            var found = _.find(question, function (answer) {


                return answer.uuid === "e1d81b62-1d5f-11e0-b929-000c29ad1d07" ||
                    answer.uuid === "e1d81c70-1d5f-11e0-b929-000c29ad1d07";
            });
            return typeof found !== "undefined";
        };

        $scope.getConceptInAnswers = function (answres, conceptUuid) {
            return _.find(answres, function (answer) {
                return answer.uuid === conceptUuid;
            });
        };

        var realValueOfField = function (conceptAnswers, obsValue) {
            return _.find(conceptAnswers, function (answer) {
                return answer.uuid === obsValue.uuid;

            });
        };


        formLogic.calculateWHOStage = function (param) {

            var whoStages = $scope.fieldModel.fieldConcept.concept.answers;

            var firstField = 0;
            var lastPart = 4;

            comuteWHOStage(firstField, lastPart, whoStages);
        }


        var comuteWHOStage = function (firstField, lastPart, whoStages) {

            for (var i = 0; i < lastPart; i++) {

                var part = $rootScope.formInfo.parts[i]
                var model = $scope.formParts.form.fields[part.fields[firstField].id]

                angular.forEach(model.fieldConcept.concept.answers, function (answer) {

                    if (model.value !== undefined) {

                        if (model.value[answer.uuid] !== "undefined") {

                            var whoStage = _.find(whoStages, function (stage) {
                                return stage.uuid === model.fieldConcept.concept.uuid;
                            });

                            $scope.fieldModel.value = whoStage;

                            return;
                        };
                    }

                });
            }
        };

        $scope.getConcepts = function (request) {
            if (request.length < 2) return;

            return $http.get(Bahmni.Common.Constants.conceptUrl, {
                    params: {
                        source: $scope.field.searchBySource,
                        q: request,
                        v: "custom:(uuid,name,display)"
                    }
                })
                .then(function (response) {
                    return response.data.results.map(function (concept) {
                        return concept;
                    });
                });
        };

}]);
