'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$scope', '$location', 'patient', 'patientService', 
                    'appService',
        function ($scope, $location, patientModel, patientService, appService) {
                
                $scope.actions = {};
                $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");

                (function () {
                    $scope.srefPrefix = "newpatient.";
                    $scope.patient = patientModel.create();
                })();
                
                $scope.initAttributes = function() {
                    $scope.patientAttributes = [];
                    angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
                        angular.forEach(value, function (value) {
                            $scope.patientAttributes.push(value);
                        });
                    });
                };
                
                $scope.save = function () {
                    var errMsg = Bahmni.Common.Util.ValidationUtil.validate($scope.patient,$scope.patientConfiguration.personAttributeTypes);
                    if(errMsg){
    //                   messagingService.showMessage('formError', errMsg);
                        return;
                    }

                    patientService.create($scope.patient).success(successCallback);
                };
                
                var successCallback = function (patientProfileData) {
                    $scope.patient.uuid = patientProfileData.patient.uuid;
                    $scope.patient.name = patientProfileData.patient.person.names[0].display;
                    $scope.patient.isNew = true;
                    $location.url("/dashboard/" + $scope.patient.uuid);
                };
        }]);
