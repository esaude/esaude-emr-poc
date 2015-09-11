'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$scope', '$rootScope', '$state', 'patient', 'patientService', 'Preferences', 'spinner', 'appService',
        function ($scope, $rootScope, $state, patientModel, patientService, preferences, spinner, appService) {
                var dateUtil = Bahmni.Common.Util.DateUtil;
                $scope.actions = {};
                $scope.patientIdentifiers = [];
                $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");

                (function () {
                    $scope.patient = patientModel.create();
                    //get patient identifier types
                    var searchPromise = patientService.getIdentifierTypes();

                    searchPromise.success(function (data) {
                        $scope.patientIdentifierTypes = data.results;
                    });
                    searchPromise['finally'](function () {
                    });
                })();

                $scope.selectIdentifierType = function () {
                    $scope.errorMessage = null;
                    
                    var patientIdentifierType = $scope.patient.patientIdentifierType;
                    if (patientIdentifierType !== null) {
                        //validate already contained
                        var found = _.find($scope.patientIdentifiers, function (chr) {
                            return chr.type.name === patientIdentifierType.name;
                        });
                        
                        if(found === undefined) {
                            $scope.patientIdentifiers.push({type: patientIdentifierType, identifier: null, preferred: false});
                        } else {
                            $scope.errorMessage = "The selected Patient Identifier Type is already contained.";
                        }
                    }
                };

                $scope.removeIdentifier = function (identifier) {
                    $scope.errorMessage = null;
                    
                    _.pull($scope.patientIdentifiers, identifier);
                };

                $scope.setPreferredId = function (identifier) {
                    angular.forEach($scope.patientIdentifiers, function (p) {
                        p.preferred = false; //set them all to false
                    });
                    identifier.preferred = true; //set the clicked one to true
                };

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
