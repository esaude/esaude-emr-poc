'use strict';

angular.module('serviceform')
    .controller('FormController', ['$rootScope', 'localStorageService','$stateParams', '$scope', '$state',  
                    '$location', 'patientAttributeService', 'encounterService', 'visitService', 'commonService',
        function ($rootScope, localStorageService, $stateParams, $scope, $state, 
                    $location, patientAttributeService, encounterService, visitService, commonService) {
                
            var dateUtil = Bahmni.Common.Util.DateUtil;
            
            (function () {
                    $scope.submitted = false;
                    $scope.visitedFields = [];
                    $scope.hasVisitToday = false;
                    
                    var formId = $stateParams.formId;
                    
                    $scope.formInfo = _.find($scope.formLayout, function (form) {
                        return form.id === formId;
                    });
                    
                    var currentSref = $state.current.url.replace("/", ".");
                    
                    $scope.currentFormPart = _.find($scope.formInfo.parts, function (formPart) {
                        return formPart.sref === currentSref;
                    });
                    //initialize visit info in scope
                    visitService.search({patient: $scope.patient.uuid, v: "full"})
                        .success(function (data) {
                            var nonRetired = commonService.filterRetired(data.results);
                            //in case the patient has an active visit
                            if (!_.isEmpty(nonRetired)) {
                                var lastVisit = _.maxBy(nonRetired, 'startDatetime');
                                var now = dateUtil.now();
                                //is last visit todays
                                if (dateUtil.parseDatetime(lastVisit.startDatetime) <= now && 
                                    dateUtil.parseDatetime(lastVisit.stopDatetime) >= now) {
                                    $scope.hasVisitToday = true;
                                    $scope.todayVisit = lastVisit;
                                } else {
                                    $scope.hasVisitToday = false;
                                }
                            }
                    });
                })();
                
                $scope.stepInFormPart = function(formPart) {
                    $scope.currentFormPart = formPart;
                };
                
                $scope.updateCurrentFormPart = function (nextSref, validity) {
                    if (validity) {
                        $scope.currentFormPart = _.find($scope.formInfo.parts, function (formPart) {
                            return formPart.sref === nextSref;
                        });
                        $scope.submitted = false;
                        $state.go($scope.formInfo.sufix + nextSref);
                    } else {
                        $scope.submitted = true;
                    }
                };
                        
                $scope.getAutoCompleteList = function (attributeName, query, type) {
                    return patientAttributeService.search(attributeName, query, type);
                };

                $scope.getDataResults = function (data) {
                    return  data.results;
                };
                
                $scope.compactName = function (name) {
                    return name.trim().replace(/[^a-zA-Z0-9]/g, '');
                };
                
                $scope.save = function () {
                    var currDate = Bahmni.Common.Util.DateUtil.now();
                    var location = localStorageService.cookie.get("emr.location");
                    
                    var encounterMapper = new Poc.Common.CreateEncounterRequestMapper(currDate);

                    var openMRSEncounter = encounterMapper.mapFromFormPayload($scope.formPayload,
                            $scope.formInfo.parts,
                            $scope.patient.uuid,
                            location.uuid,
                            $rootScope.currentUser.person.uuid);//set date
                    
                    if ($rootScope.postAction === 'create') {
                        //in case the service has a date mark
                        if ($rootScope.maskedOn) {
                            var obs = {
                                concept: $rootScope.maskedOn,
                                obsDatetime: dateUtil.now(),
                                person: openMRSEncounter.patient,
                                value: dateUtil.getDateInDatabaseFormat(dateUtil.now())
                            };
                            openMRSEncounter.obs.push(obs);
                        }
                        
                        if ($scope.hasVisitToday) {
                            encounterService.create(openMRSEncounter).success(encounterSuccessCallback);
                        } else {
                            checkIn().then(encounterService.create(openMRSEncounter).success(encounterSuccessCallback));
                        }
                    }
                    
                    if ($rootScope.postAction === 'edit') {
                        var encounterMapper = new Poc.Common.UpdateEncounterRequestMapper(currDate);
                        
                        var editEncounter = encounterMapper.mapFromFormPayload(openMRSEncounter,
                                $scope.formPayload.encounter);//set date
                        encounterService.update(editEncounter).success(encounterSuccessCallback);
                    }
                };
                
                var checkIn = function () {
                    var visitType = _.find($rootScope.defaultVisitTypes, function (o) {
                            return o.occurOn === "following";
                        });
                    var location = localStorageService.cookie.get("emr.location");
                    //create visit object
                    var visit = {
                        patient: $scope.patient.uuid,
                        visitType: visitType.uuid,
                        location: location.uuid,
                        startDatetime: dateUtil.now(),
                        stopDatetime: dateUtil.endOfToday()
                    };
                    return visitService.create(visit);
                };
                
                var encounterSuccessCallback = function (encounterProfileData) {
                    $scope.hasVisitToday = true;
                    $location.url('/dashboard/' + encounterProfileData.patient.uuid);
                };
                
                $scope.linkDashboard = function () {
                    $location.url('/dashboard/' + $rootScope.patient.uuid);
                };
                
                
        }]);
