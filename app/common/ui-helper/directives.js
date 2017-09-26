'use strict';

angular.module('bahmni.common.uiHelper')
    .directive('myAutocomplete', function ($parse) {
        var link = function (scope, element, attrs, ngModelCtrl) {
            var ngModel = $parse(attrs.ngModel);
            var source = scope.source();
            var responseMap = scope.responseMap();
            var onSelect = scope.onSelect();

            element.autocomplete({
                autofocus: true,
                minLength: 2,
                source: function (request, response) {
                    source(attrs.id, request.term, attrs.itemType).success(function (data) {
                        var results = responseMap ? responseMap(data) : data;
                        response(results);
                    });
                },
                select: function (event, ui) {
                    scope.$apply(function (scope) {
                        ngModelCtrl.$setViewValue(ui.item.value);
                        scope.$eval(attrs.ngChange);
                        if (onSelect != null) {
                            onSelect(ui.item);
                        }
                    });
                    return true;
                },
                search: function (event) {
                    var searchTerm = $.trim(element.val());
                    if (searchTerm.length < 2) {
                        event.preventDefault();
                    }
                }
            });
        };
        return {
            link: link,
            require: 'ngModel',
            scope: {
                source: '&',
                responseMap: '&',
                onSelect: '&'
            }
        }
    })
    .directive('patternValidate', function () {
        return function ($scope, element, attrs) {
            var addPatternToElement = function () {
                if($scope.fieldValidation && $scope.fieldValidation[attrs.id]){
                    element.attr({"pattern": $scope.fieldValidation[attrs.id].pattern, "title": $scope.fieldValidation[attrs.id].errorMessage, "type": "text"});
                }
            };

            $scope.$watch(attrs.patternValidate, function () {
                addPatternToElement();
            });
        }
    });
