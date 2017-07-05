(function () {
  'use strict';

  angular.module('bahmni.common.domain')
    .factory('encounterService', encounterService);

  encounterService.$inject = ['$http', '$q', '$rootScope', 'configurations', '$cookieStore', '$log', 'appService'];

  function encounterService($http, $q, $rootScope, configurations, $cookieStore, $log, appService) {

    var FILA_ENCOUNTER_TYPE_UUID = "e279133c-1d5f-11e0-b929-000c29ad1d07";

    var CHILD_FOLLOWUP_ENCOUNTER_TYPE_UUID = Bahmni.Common.Constants.childFollowupEncounterUuid;

    var ADULT_FOLLOWUP_ENCOUNTER_TYPE_UUID = Bahmni.Common.Constants.adultFollowupEncounterUuid;

    var sortByEncounterDateTime = _.curryRight(_.sortBy, 2)(function (encounter) {
      return new Date(encounter.encounterDatetime);
    });

    return {
      create: create,
      delete: _delete,
      filterRetiredEncoounters: filterRetiredEncoounters,
      find: find,
      getEncountersForEncounterType: getEncountersForEncounterType,
      getPatientChildFollowupEncounters: getPatientChildFollowupEncounters,
      getPatientAdultFollowupEncounters: getPatientAdultFollowupEncounters,
      getPatientFilaEncounters: getPatientFilaEncounters,
      getEncountersOfPatient: getEncountersOfPatient,
      search: search,
      update: update
    };

    function getDefaultEncounterType() {
      var url = Bahmni.Common.Constants.encounterTypeUrl;
      return $http.get(url + '/' + configurations.defaultEncounterType()).then(function (response) {
        return response.data;
      });
    }

    //TODO: Unused definition, to be removed after testing phase
    // this.getEncounterType = function (programUuid) {
    //     if(programUuid == null) {
    //         return getDefaultEncounterType();
    //     }
    //     return $http.get(Bahmni.Common.Constants.entityMappingUrl, {
    //         params: {
    //             entityUuid: programUuid,
    //             mappingType: 'program_encountertype',
    //             s: 'byEntityAndMappingType'
    //         },
    //         withCredentials: true
    //     }).then(function (response) {
    //         var encounterType=response.data.results[0].mappings[0];
    //         if(!encounterType) {
    //             encounterType = getDefaultEncounterType();
    //         }
    //         return encounterType;
    //     });
    // };

    function create(encounter) {
      //encounter = this.buildEncounter(encounter);

      return $http.post(Bahmni.Common.Constants.encounterUrl, encounter, {
        withCredentials: true,
        headers: {"Accept": "application/json", "Content-Type": "application/json"}
      });
    }

    function update(encounter) {
      //encounter = this.buildEncounter(encounter);

      return $http.post(Bahmni.Common.Constants.encounterUrl + "/" + encounter.uuid, encounter, {
        withCredentials: true,
        headers: {"Accept": "application/json", "Content-Type": "application/json"}
      });
    }

    function _delete(encounterUuid, reason) {
      return $http.delete(Bahmni.Common.Constants.bahmniEncounterUrl + "/" + encounterUuid, {
        params: {reason: reason}
      });
    }

    function stripExtraConceptInfo(obs) {
      obs.concept = {uuid: obs.concept.uuid, name: obs.concept.name, dataType: obs.concept.dataType};
      obs.groupMembers = obs.groupMembers || [];
      obs.groupMembers.forEach(function (groupMember) {
        stripExtraConceptInfo(groupMember);
      });
    }

    function searchWithoutEncounterDate(visitUuid) {
      return $http.post(Bahmni.Common.Constants.bahmniEncounterUrl + '/find', {
        visitUuids: [visitUuid],
        includeAll: Bahmni.Common.Constants.includeAllObservations
      }, {
        withCredentials: true
      });
    }

    function search(visitUuid, encounterDate) {
      if (!encounterDate) return searchWithoutEncounterDate(visitUuid);

      return $http.get(Bahmni.Common.Constants.emrEncounterUrl, {
        params: {
          visitUuid: visitUuid,
          encounterDate: encounterDate,
          includeAll: Bahmni.Common.Constants.includeAllObservations
        },
        withCredentials: true
      });
    }

    function getEncountersOfCurrentVisit(patientUuid) {
      var deferredEncounters = $q.defer();
      var options = {
        method: "GET",
        params: {
          patient: patientUuid,
          includeInactive: false,
          v: "custom:(uuid,encounters:(uuid,encounterDatetime,encounterType:(uuid,name,retired)))"
        },
        withCredentials: true
      };

      $http.get(Bahmni.Common.Constants.visitUrl, options).success(function (data) {
        var encounters = [];
        if (data.results.length > 0) {
          encounters = data.results[0].encounters;
          encounters.forEach(function (enc) {
            if (typeof enc.encounterDatetime == 'string') {
              enc.encounterDatetime = Bahmni.Common.Util.DateUtil.parse(enc.encounterDatetime);
            }
            enc.encounterTypeUuid = enc.encounterType.uuid;
          });
        }
        deferredEncounters.resolve(encounters);
      }).error(function (e) {
        deferredEncounters.reject(e);
      });
      return deferredEncounters.promise;
    }

    //TODO: Unused definition, to be removed after testing phase
    // this.identifyEncounterForType = function(patientUuid, encounterTypeUuid) {
    //     var searchable = $q.defer();
    //     getEncountersOfCurrentVisit(patientUuid).then(function(encounters) {
    //         if (encounters.length == 0) {
    //             searchable.resolve(null);
    //             return;
    //         }
    //         var selectedEnc = null;
    //         encounters.sort(function(e1, e2) {
    //             return e2.encounterDatetime - e1.encounterDatetime;
    //         });
    //         for (var i = 0, count =  encounters.length; i < count; i++) {
    //             if (encounters[i].encounterTypeUuid == encounterTypeUuid) {
    //                 selectedEnc = encounters[i];
    //                 break;
    //             }
    //         }
    //         searchable.resolve(selectedEnc);
    //     },
    //     function(responseError) {
    //         searchable.reject("Couldn't identify prerequisite encounter for this operation.");
    //     });
    //     return searchable.promise;
    // };

    function find(params) {
      return $http.post(Bahmni.Common.Constants.bahmniEncounterUrl + '/find', params, {
        withCredentials: true
      });
    }

    //TODO: Unused definition, to be removed after testing phase
    // this.findByEncounterUuid = function (encounterUuid) {
    //     return $http.get(Bahmni.Common.Constants.bahmniEncounterUrl + '/' + encounterUuid, {
    //         params: {includeAll : true},
    //         withCredentials: true
    //     });
    // };

    function getEncountersForEncounterType(patientUuid, encounterTypeUuid, v) {
      if (typeof v === "undefined") {
        v = "custom:(uuid,encounterDatetime,provider,voided,visit:(uuid,startDatetime,stopDatetime),obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),order,obsDatetime,value)))";
      }
      return $http.get(Bahmni.Common.Constants.encounterUrl, {
        params: {
          patient: patientUuid,
          encounterType: encounterTypeUuid,
          v: v
        },
        withCredentials: true
      });
    }

    /**
     * @param {String} patientUUID
     * @param {String} v
     * @returns {Array} Non retired adult followup encounters for patient ordered by most recent.
     */
    function getPatientChildFollowupEncounters(patientUUID, v) {
      return getEncountersForEncounterType(patientUUID, CHILD_FOLLOWUP_ENCOUNTER_TYPE_UUID, v)
        .then(function (response) {
          return _.flow([filterRetiredEncoounters, sortByEncounterDateTime, _.reverse])(response.data.results);
        })
        .catch(function (error) {
          $log.error('XHR Failed for getPatientChildFollowupEncounters. ' + error.data);
          return $q.reject(error);
        })
    }

    /**
     * @param {String} patientUUID
     * @param {String} v
     * @returns {Array} Non retired adult followup encounters for patient ordered by most recent.
     */
    function getPatientAdultFollowupEncounters(patientUUID, v) {
      return getEncountersForEncounterType(patientUUID, ADULT_FOLLOWUP_ENCOUNTER_TYPE_UUID, v)
        .then(function (response) {
          return _.flow([filterRetiredEncoounters, sortByEncounterDateTime, _.reverse])(response.data.results);
        })
        .catch(function (error) {
          $log.error('XHR Failed for getPatientAdultFollowupEncounters. ' + error.data);
          return $q.reject(error);
        })
    }

    /**
     * @param {String} patientUuid Patient UUID
     * @param {String} v
     * @returns {Array} Non retired pharmacy encounters for patient ordered by most recent.
     */
    function getPatientFilaEncounters(patientUuid, v) {

      var filaObsList = Poc.Pharmacy.Constants.filaObsList;

      function getEncountersComplete(response) {
        var nonVoided = _.filter(response.data.results, function (e) { return !e.voided; }).reverse();
        // TODO Should be extracted to mapper
        return _.map(nonVoided, function (e) {
          return {
            encounterDatetime: new Date(e.encounterDatetime),
            regimen: valueOfField(filaObsList.regimen, e.obs),
            posology: valueOfField(filaObsList.posology, e.obs),
            quantity: valueOfField(filaObsList.quantity, e.obs),
            nextPickup: valueOfField(filaObsList.nextPickup, e.obs),
            provider: e.provider.display
          }
        });
      }

      function getEncountersFailed(error) {
        $log.error('XHR Failed for getPatientFilaEncounters. ' + error.data);
        return $q.reject(error);
      }

      return getEncountersForEncounterType(patientUuid, FILA_ENCOUNTER_TYPE_UUID, v)
        .then(getEncountersComplete)
        .catch(getEncountersFailed);
    }

    function valueOfField(conceptUuid, obs) {

      var field = _.find(obs, function (o) {
        return o.concept.uuid === conceptUuid;
      });

      if (angular.isUndefined(field))
        return field;

      if (_.isObject(field.value)) {
        return field.value.display;
      } else {
        return field.value;
      }
    }

    //TODO: Unused definition, to be removed after testing phase
    // this.getEncountersForEncounterTypeAllPatients = function(encounterTypeUuid) {
    //     return $http.get(Bahmni.Common.Constants.encounterUrl, {
    //         params:{
    //             encounterType: encounterTypeUuid,
    //             v: "custom:(uuid,patient,encounterDatetime,provider,voided,visit:(uuid,startDatetime,stopDatetime),obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value)))"
    //         },
    //         withCredentials : true
    //     });
    // };

    function getEncountersOfPatient(patientUuid) {
      return $http.get(Bahmni.Common.Constants.encounterUrl, {
        params: {
          patient: patientUuid,
          v: "custom:(uuid,encounterType,encounterDatetime,provider,voided,visit:(uuid,startDatetime,stopDatetime),obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value)))"
        },
        withCredentials: true
      });
    }

    //TODO: Unused definition, to be removed after testing phase
    // this.getDigitized = function(patientUuid) {
    // var patientDocumentEncounterTypeUuid = configurations.encounterConfig().getPatientDocumentEncounterTypeUuid();
    //     return $http.get(Bahmni.Common.Constants.encounterUrl, {
    //         params:{
    //             patient: patientUuid,
    //             encounterType: patientDocumentEncounterTypeUuid,
    //             v: "custom:(uuid,obs:(uuid))"
    //         },
    //         withCredentials : true
    //     });
    // };

    function filterRetiredEncoounters(encounters) {
      return _.filter(encounters, function (encounter) {
        return !encounter.voided;
      });
    }
  }

})();
