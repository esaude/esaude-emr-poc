'use strict';

angular.module('patient.details')
    .directive('addressFields', function () {
        return {
            restrict: 'AE',
            templateUrl: ' views/addressFields.html',
            controller: 'AddressFieldsDirectiveController',
            scope: {
                address: '=',
                addressLevels: '=',
                fieldValidation: '='
            }
        };
    })
    .controller('AddressFieldsDirectiveController', function ($scope, addressAttributeService) {
        var addressLevelsCloneInAscendingOrder = $scope.addressLevels;
        $scope.addressLevelsChunks = Bahmni.Common.Util.ArrayUtil.chunk(addressLevelsCloneInAscendingOrder, 2);

        var addressLevelsInAscendingOrder = addressLevelsCloneInAscendingOrder.map(function (addressLevel) {
            return addressLevel.addressField;
        });
        var autocompletedFields = [];
        $scope.addressFieldSelected = function (fieldName) {
            return function (addressFieldItem) {
                var startAddress = 0;
                var endAddress = addressLevelsInAscendingOrder.indexOf(fieldName) ;

                var parentFields = addressLevelsInAscendingOrder.slice(startAddress, endAddress).reverse();
                var parent = addressFieldItem.addressField.parent;
                parentFields.forEach(function (parentField) {
                    if (!parent) return;
                    $scope.address[parentField] = parent.name;
                    parent = parent.parent;
                });
                autocompletedFields = [];
                autocompletedFields.push(fieldName);
                autocompletedFields = autocompletedFields.concat(parentFields);
            }
        };

        $scope.getAddressEntryList = function (field) {
            return function (searchAttrs) {
                return addressAttributeService.search(field, searchAttrs.term);
            };
        };

        var getNextAvailableParentName = function (addressField) {
            var parent = addressField.parent;
            while (parent) {
                if (parent.name) return parent.name;
                else parent = parent.parent;
            }
        };

        $scope.getAddressDataResults = function (data) {
            return data.data.map(function (addressField) {
                var parentName = getNextAvailableParentName(addressField);
                return {
                    'value': addressField.name,
                    'label': addressField.name + ( parentName ? ", " + parentName : "" ),
                    addressField: addressField
                }
            });
        };
        $scope.clearFields = function (fieldName) {
            if(_.includes(autocompletedFields, fieldName)) {
                var childFields = autocompletedFields.slice(0, autocompletedFields.indexOf(fieldName));
                childFields.forEach(function (childField) {
                    $scope.address[childField] = "";
                });
            }
        };

        $scope.$watch('$parent.showMessages', function (value) {
            $scope.showMessages = value;
        });
    });
