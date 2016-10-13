'use strict';

angular.module('registration')
        .controller('VisitController', ['$rootScope', '$scope', '$stateParams', '$location', 'visitService', 'encounterService', 
            'commonService', 'localStorageService',
                    function ($rootScope, $scope, $stateParams, $location, visitService, encounterService, 
                        commonService, localStorageService) {
            var patientUuid;
            var dateUtil = Bahmni.Common.Util.DateUtil;
    
            function init() {
                patientUuid = $stateParams.patientUuid;
                $scope.todayVisit = null;
                $scope.lastUnclosedVisit = null;
                $scope.disableCheckin = false;
                
                visitService.search({patient: patientUuid, 
                    v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'})
                .success(function (data) {          
                    $scope.lastVisit = _.maxBy(data.results, 'startDatetime');
                });
                
                encounterService.getEncountersForEncounterType(patientUuid, 
                    ($rootScope.patient.age.years >= 15) ? $rootScope.encounterTypes.followUpAdult : 
                                                                $rootScope.encounterTypes.followUpChild)
                            .success(function (data) {
                                var last = _.maxBy(data.results, 'encounterDatetime');
                                if (!last) return;
                                $scope.lastConsultation = last;
                                $scope.nextConsultation = _.find(last.obs, function (o) {
                                    return o.concept.uuid === "e1dae630-1d5f-11e0-b929-000c29ad1d07";
                                });
                            }
                );
        
                encounterService.getEncountersForEncounterType(patientUuid, $rootScope.encounterTypes.pharmacy)
                            .success(function (data) {
                                var last = _.maxBy(data.results, 'encounterDatetime');
                                if (!last) return;
                                $scope.lastPharmacy = last;
                                $scope.nextPharmacy = _.find(last.obs, function (o) {
                                    return o.concept.uuid === "e1e2efd8-1d5f-11e0-b929-000c29ad1d07";
                                });
                            }
                );

                visitService.search({patient: patientUuid, v: "full"}).success(searchVisitByPatientCallback);
            };

            var searchVisitByPatientCallback = function (data) {
                var nonRetired = commonService.filterRetired(data.results);
                $scope.isFirstVisit = _.isEmpty(nonRetired);
                var unclosed = visitService.activeVisits(nonRetired);
                //in case the patient has an active visit
                if (!_.isEmpty(unclosed)) {
                    $scope.lastUnclosedVisit = _.maxBy(unclosed, 'startDatetime');
                    $scope.lastUnclosedVisit = fixVisitDatetime($scope.lastUnclosedVisit);
                    $scope.disableCheckin = true;
                } else {
                    var lastVisit = _.maxBy(nonRetired, 'startDatetime');
                    lastVisit = fixVisitDatetime(lastVisit);
                    var now = dateUtil.now();

                    //is last visit todays
                    if (dateUtil.parseDatetime(lastVisit.startDatetime) <= now && 
                        dateUtil.parseDatetime(lastVisit.stopDatetime) >= now) {
                        $scope.todayVisit = lastVisit;
                        $scope.disableCheckin = true;
                    }
                }
            };

            $scope.checkIn = function () {
                var visitType = null;
                if ($scope.isFirstVisit) {
                    visitType = _.find($rootScope.defaultVisitTypes, function (o) {
                        return o.occurOn === "first";
                    });
                } else {
                    visitType = _.find($rootScope.defaultVisitTypes, function (o) {
                        return o.occurOn === "following";
                    });
                }
                var location = localStorageService.cookie.get("emr.location");
                //create visit object
                var visit = {
                    patient: patientUuid,
                    visitType: visitType.uuid,
                    location: location.uuid,
                    startDatetime: dateUtil.now(),
                    stopDatetime: dateUtil.endOfToday()
                };
                visitService.create(visit).success(successCallback);
            };

            var successCallback = function (visitProfileData) {
                $scope.todayVisit = visitProfileData;
                $scope.todayVisit.startDatetime = dateUtil.removeOffset($scope.todayVisit.startDatetime);
                $scope.todayVisit.stopDatetime = dateUtil.removeOffset($scope.todayVisit.stopDatetime);
                $rootScope.hasVisitToday = true;
                $scope.disableCheckin = true;
            };

            var fixVisitDatetime = function (visit) {
                visit.startDatetime = dateUtil.removeOffset(visit.startDatetime);
                visit.stopDatetime = dateUtil.removeOffset(visit.stopDatetime);
                return visit;
            }
            
            $scope.visitHistory = function () {
              encounterService.getEncountersOfPatient(patientUuid).success(function (data) {
                $scope.visits = commonService.filterGroupReverse(data);
              });
            }

            init();

        }]);
