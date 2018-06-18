'use strict';

angular.module('bahmni.common.uiHelper')
    .directive('myAutocomplete', $parse => {
        var link = (scope, element, attrs, ngModelCtrl) => {
            var ngModel = $parse(attrs.ngModel);
            var source = scope.source();
            var responseMap = scope.responseMap();
            var onSelect = scope.onSelect();

            element.autocomplete({
                autofocus: true,
                minLength: 2,
                source: (request, response) => {
                    source(attrs.id, request.term, attrs.itemType).success(data => {
                        var results = responseMap ? responseMap(data) : data;
                        response(results);
                    });
                },
                select: (event, ui) => {
                    scope.$apply(scope => {
                        ngModelCtrl.$setViewValue(ui.item.value);
                        scope.$eval(attrs.ngChange);
                        if (onSelect != null) {
                            onSelect(ui.item);
                        }
                    });
                    return true;
                },
                search: event => {
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
        };
    })
    .directive('patternValidate', () => ($scope, element, attrs) => {
      var addPatternToElement = () => {
        if ($scope.fieldValidation && $scope.fieldValidation[attrs.id]) {
          element.attr({
            "pattern": $scope.fieldValidation[attrs.id].pattern,
            "title": $scope.fieldValidation[attrs.id].errorMessage,
            "type": "text"
          });
        }
      };

      $scope.$watch(attrs.patternValidate, () => {
        addPatternToElement();
      });
    });
