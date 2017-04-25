'use strict';

angular.module('application')
        .controller('MovePatientActionController', ["$scope", "ngDialog",
                    function ($scope, ngDialog) {

            $scope.movePatientTo = function () {
                ngDialog.open({ template: '../common/application/views/movePatient.html',
                                controller: 'MovePatientDialogController',
                                width: '60%',
                                showClose: false});
            };
        }]);
