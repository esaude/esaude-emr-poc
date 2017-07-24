'use strict';

angular.module('serviceform')
    .controller('FormPrintController', ['$rootScope', '$scope', '$location',
        function ($rootScope, $scope, $location) {
                
            var dateUtil = Bahmni.Common.Util.DateUtil;
            
                
            $scope.linkDashboard = function () {
                $location.url('/dashboard/' + $rootScope.patient.uuid);
            };
                
                
        }]);
