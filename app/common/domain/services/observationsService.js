'use strict';

angular.module('bahmni.common.domain')
    .service('observationsService', ['$http', function ($http) {

        this.filterByList = function (obsList, concepts) {
            var filtered = _.filter(obsList, function (data) {
                return _.includes(concepts, data.concept.uuid);
            });
            //find inside groups
            if(_.isEmpty(filtered)) {
                _.forEach(obsList, function (data) {
                   if(data.groupMembers !== null) {
                       var groupFiltered = _.filter(data.groupMembers, function (member) {
                            return _.includes(concepts, member.concept.uuid);
                        });
                        if(!_.isEmpty(groupFiltered)) {
                            filtered = _.union(filtered, groupFiltered);
                        }
                   }
                });
            }
            return filtered;
        };

        this.get = function (patientUuid, concept) {
            return $http.get('/openmrs/ws/rest/v1/obs', {
                params: {
                    patient : patientUuid,
                    concept : concept,
                    v: "custom:(uuid,display,encounter:(encounterDatetime,encounterType,provider:(display,uuid)),voided,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value))"
                },
                withCredentials: true
            });
        };

        this.findAll = function (patientUuid) {
            return $http.get('/openmrs/ws/rest/v1/obs', {
                params: {
                    patient : patientUuid,
                    v: "custom:(uuid,display,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value))"
                },
                withCredentials: true
            });
        };

        this.fetch = function (patientUuid, conceptNames, scope, numberOfVisits, visitUuid, obsIgnoreList, filterObsWithOrders) {
            var params = {concept: conceptNames};
            if(obsIgnoreList) {
                params.obsIgnoreList = obsIgnoreList
            }
            if(filterObsWithOrders) {
                params.filterObsWithOrders = filterObsWithOrders;
            }

            if(visitUuid){
                params.visitUuid = visitUuid;
                params.scope = scope;
            }
            else{
                params.patientUuid = patientUuid;
                params.numberOfVisits = numberOfVisits;
                params.scope = scope;
            }
            return $http.get(Bahmni.Common.Constants.observationsUrl, {
                params: params,
                withCredentials: true
            });
        };

        this.getObsRelationship = function(targetObsUuid){
            return $http.get(Bahmni.Common.Constants.obsRelationshipUrl, {
                params: {
                    targetObsUuid: targetObsUuid
                },
                withCredentials: true
            });
        };

        this.filterRetiredObs = function (observations) {
        return _.filter(observations, function (obs) {
            return !obs.voided;
        });
    };

    }]);
