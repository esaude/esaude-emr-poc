'use strict';

angular.module('registration')
    .controller('PatientCommonController', ['$scope', '$location', '$state', 'patientAttributeService', 'patientService', 'localStorageService',
        function ($scope, $location, $state, patientAttributeService, patientService, localStorageService) {
            
                var dateUtil = Bahmni.Common.Util.DateUtil;
                
                (function () {
                    $scope.showMessages = false;
                    $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());
                    //get patient identifier types
                    var searchPromise = patientService.getIdentifierTypes();

                    searchPromise.success(function (data) {
                        $scope.patientIdentifierTypes = data.results;
                    });
                    searchPromise['finally'](function () {
                    });
                })();
                
                $scope.listRequiredIdentifiers = function () {
                    if (!_.isEmpty($scope.patient.identifiers)) {
                        return;
                    }
                    _.forEach ($scope.patientIdentifierTypes, function (value) {
                        if (value.required) {
                            var fieldName = value.name.trim().replace(/[^a-zA-Z0-9]/g, '');
                            $scope.patient.identifiers.push({identifierType: value, 
                                identifier: null, preferred: false, 
                                location: localStorageService.cookie.get("emr.location").uuid, 
                                fieldName : fieldName});
                        }
                    });  
                };
                

                $scope.selectIdentifierType = function () {
                    
                    $scope.errorMessage = null;
                    
                    var patientIdentifierType = $scope.patient.patientIdentifierType;
                    if (patientIdentifierType !== null) {
                        //validate already contained
                        var found = _.find($scope.patient.identifiers, function (chr) {
                            return chr.identifierType.display === patientIdentifierType.display;
                        });
                        
                        if(found === undefined) {
                            var fieldName = patientIdentifierType.name.trim().replace(/[^a-zA-Z0-9]/g, '');
                            $scope.patient.identifiers.push({identifierType: patientIdentifierType, 
                                identifier: null, preferred: false, 
                                location: localStorageService.cookie.get("emr.location").uuid, 
                                fieldName : fieldName});
                        } else {
                            $scope.errorMessage = "The selected Patient Identifier Type is already contained.";
                        }
                    }
                };

                $scope.removeIdentifier = function (identifier) {
                    $scope.errorMessage = null;
                    
                    _.pull($scope.patient.identifiers, identifier);
                };

                $scope.setPreferredId = function (identifier) {
                    angular.forEach($scope.patient.identifiers, function (p) {
                        p.preferred = false; //set them all to false
                    });
                    identifier.preferred = true; //set the clicked one to true
                };
                
                $scope.stepForward = function (sref, validity) {
                    if (validity) {
                        $scope.showMessages = false;
                        $state.go($scope.srefPrefix + sref);
                    } else {
                        $scope.showMessages = true;
                    }
                };
                
                $scope.getAutoCompleteList = function (attributeName, query, type) {
                    return patientAttributeService.search(attributeName, query, type);
                };
                
                $scope.getDataResults = function (data) {
                    return  data.results;
                };
        }]);
