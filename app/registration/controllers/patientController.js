'use strict';

angular.module('registration')
        .controller('PatientController', function ($scope, $location) {
            
            $scope.linkSearch = function() {
                $location.url("/search");
            };
        });
