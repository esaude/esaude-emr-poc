'use strict';

angular.module('clinic')
        .controller('DashboardController', ["$scope", "$location", "$stateParams", 
                    function ($scope, $location, $stateParams) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
            }
            
            $scope.linkSearch = function() {
                $location.url("/search"); // path not hash
            };
            
        }]);
