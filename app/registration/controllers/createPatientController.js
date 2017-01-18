'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$rootScope', '$scope', '$location', 'patient', 'patientService',
                    'appService', 'openmrsPatientMapper', 'notifier',
        function ($rootScope, $scope, $location, patientModel, patientService, appService, patientMapper, notifier) {

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
                    $rootScope.patient = patientMapper.map(patientProfileData.patient);
                    $scope.patient.uuid = patientProfileData.patient.uuid;
                    $scope.patient.name = patientProfileData.patient.person.names[0].display;
                    $scope.patient.isNew = true;
                    notifier.success("Patient Created");
                    $location.url("/dashboard/" + $scope.patient.uuid);
                };
        }]);
