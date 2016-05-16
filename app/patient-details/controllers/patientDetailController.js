'use strict';

angular.module('patient.details')
        .controller('DetailPatientController', ["$scope", "$stateParams", "$location",
                function ($scope, $stateParams, $location) {
            var patientUuid;
    
            (function () {
                patientUuid = $stateParams.patientUuid;
            })();
            
            $scope.initAttributes = function() {
                $scope.patientAttributes = [];
                angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
                    angular.forEach(value, function (value) {
                        $scope.patientAttributes.push(value);
                    });
                });
            };
            
            $scope.linkDashboard = function() {
                $location.url("/dashboard/" + patientUuid); // path not hash
            };
        }]);
