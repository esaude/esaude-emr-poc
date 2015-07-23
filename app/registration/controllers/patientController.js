'use strict';

angular.module('registration')
        .controller('NewPatientController', function ($scope, $location) {
            
            $scope.linkSearch = function() {
                $location.url("/search");
            };
        });
