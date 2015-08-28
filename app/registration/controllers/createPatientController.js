'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$scope', '$rootScope', '$state', 'patient', 'patientService', 'Preferences', 'spinner', 'configurations',
        function ($scope, $rootScope, $state, patientModel, patientService, preferences, spinner, configurations) {
            var dateUtil = Bahmni.Common.Util.DateUtil;
            $scope.actions = {};
            $scope.addressHierarchyConfigs = {
                "freeTextAddressFields": ["address2", "address1"]
            };
            
            (function () {
                $scope.patient = patientModel.create();
                var configNames = ['addressLevels'];
                return configurations.load(configNames).then(function () {
                    $rootScope.addressLevels = configurations.addressLevels();
                });
            })();

            $scope.create = function () {
                setPreferences();
                var errMsg = Bahmni.Common.Util.ValidationUtil.validate($scope.patient,$scope.patientConfiguration.personAttributeTypes);
                if(errMsg){
//                    messagingService.showMessage('formError', errMsg);
                    return;
                }
                if($rootScope.newlyAddedRelationships && $rootScope.newlyAddedRelationships.length > 1) {
                    $rootScope.newlyAddedRelationships.shift();
                    $scope.patient.relationships = $rootScope.newlyAddedRelationships;
                }

                if (!$scope.hasOldIdentifier) {
                    spinner.forPromise(patientService.generateIdentifier($scope.patient)
                        .then(function (response) {
                            $scope.patient.identifier = response.data;
                            patientService.create($scope.patient).success(successCallback);
                        }));
                }
                else{
                    patientService.create($scope.patient).success(successCallback);
                }
            };

            var setPreferences = function () {
                preferences.identifierPrefix = $scope.patient.identifierPrefix.prefix;
            };

            var successCallback = function (patientProfileData) {
                $scope.patient.uuid = patientProfileData.patient.uuid;
                $scope.patient.name = patientProfileData.patient.person.names[0].display;
                $scope.patient.isNew = true;
                $scope.patient.registrationDate = dateUtil.now();
                $scope.actions.followUpAction(patientProfileData);
            };

            $scope.afterSave = function () {
//                messagingService.showMessage("info", "Saved");
//                $state.go("patient.edit", {patientUuid: $scope.patient.uuid});
            };

        }]);
