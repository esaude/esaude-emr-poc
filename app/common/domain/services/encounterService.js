(function () {
  'use strict';

  angular.module('bahmni.common.domain')
    .factory('encounterService', encounterService);

  encounterService.$inject = ['$http', '$q', 'configurations', '$log'];

  function encounterService($http, $q, configurations, $log) {

    var FILA_ENCOUNTER_TYPE_UUID = "e279133c-1d5f-11e0-b929-000c29ad1d07";

    var CHILD_FOLLOWUP_ENCOUNTER_TYPE_UUID = Bahmni.Common.Constants.childFollowupEncounterUuid;

    var ADULT_FOLLOWUP_ENCOUNTER_TYPE_UUID = Bahmni.Common.Constants.adultFollowupEncounterUuid;

    var PATIENT_CHILD_AGE = 14;

    var sortByEncounterDateTime = _.curryRight(_.sortBy, 2)(function (encounter) {
      return new Date(encounter.encounterDatetime);
    });

    return {
      create: create,
      delete: _delete,
      filterRetiredEncoounters: filterRetiredEncoounters,
      find: find,
      getEncountersForEncounterType: getEncountersForEncounterType,
      getPatientFollowupEncounters: getPatientFollowupEncounters,
      getPatientFilaEncounters: getPatientFilaEncounters,
      getEncountersOfPatient: getEncountersOfPatient,
      getEncountersForPatientByEncounterType: getEncountersForPatientByEncounterType,
      search: search,
      update: update
    };

    function getDefaultEncounterType() {
      var url = Bahmni.Common.Constants.encounterTypeUrl;
      return $http.get(url + '/' + configurations.defaultEncounterType()).then(function (response) {
        return response.data;
      });
    }

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

    function find(params) {
      return $http.post(Bahmni.Common.Constants.bahmniEncounterUrl + '/find', params, {
        withCredentials: true
      });
    }

    /**
     * @deprecated {@see getEncountersForPatientByEncounterType}
     * @param patientUuid
     * @param encounterTypeUuid
     * @param v
     */
    function getEncountersForEncounterType(patientUuid, encounterTypeUuid, v) {
      if (!v) {
        v = "custom:(uuid,encounterDatetime,provider,voided,visit:(uuid,startDatetime,stopDatetime),obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),order:(uuid,voided,drug,quantity,dose,doseUnits,frequency,quantityUnits,dosingInstructions,duration,durationUnits,route),obsDatetime,value)))";
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
     * @param patientUUID
     * @param encounterTypeUUID
     * @param representation
     * @returns {Promise} Non retired encounters for patient by encounterType ordered by most recent.
     */
    function getEncountersForPatientByEncounterType(patientUUID, encounterTypeUUID, representation) {

      var config = {
        params: {
          patient: patientUUID,
          encounterType: encounterTypeUUID
        },
        withCredentials: true
      };

      if (representation) {
        config.params.v = representation
      }

      return $http.get(Bahmni.Common.Constants.encounterUrl, config)
        .then(function (response) {
          return _.flow([filterRetiredEncoounters, sortByEncounterDateTime, _.reverse])(response.data.results);
        }).catch(function (error) {
          $log.error('XHR Failed for getEncountersForPatientByEncounterType: ' + error.data.error.message);
          return $q.reject();
      });
    }

    /**
     * @param {Object} patient Patient.
     * @param {String} [representation=full] Resource representation.
     * @returns {Promise} Non retired followup encounters for patient ordered by most recent.
     */
    function getPatientFollowupEncounters(patient, representation) {
      if (patient.age.years > PATIENT_CHILD_AGE) {
        return getPatientAdultFollowupEncounters(patient.uuid, representation);
      }
      return getPatientChildFollowupEncounters(patient.uuid, representation);
    }


    /**
     * @param {String} patientUUID Patient UUID.
     * @param {String} [representation=full] Resouce reprentation.
     * @returns {Promise} Non retired adult followup encounters for patient ordered by most recent.
     */
    function getPatientChildFollowupEncounters(patientUUID, representation) {
      return getEncountersForEncounterType(patientUUID, CHILD_FOLLOWUP_ENCOUNTER_TYPE_UUID, representation || "full")
        .then(function (response) {
          return _.flow([filterRetiredEncoounters, sortByEncounterDateTime, _.reverse])(response.data.results);
        })
        .catch(function (error) {
          $log.error('XHR Failed for getPatientChildFollowupEncounters: ' + error.data.error.message);
          return $q.reject(error);
        })
    }


    /**
     * @param {String} patientUUID Patient UUID.
     * @param {String} [representation=full] Resouce reprentation.
     * @returns {Promise} Non retired adult followup encounters for patient ordered by most recent.
     */
    function getPatientAdultFollowupEncounters(patientUUID, representation) {
      return getEncountersForEncounterType(patientUUID, ADULT_FOLLOWUP_ENCOUNTER_TYPE_UUID, representation || "full")
        .then(function (response) {
          return _.flow([filterRetiredEncoounters, sortByEncounterDateTime, _.reverse])(response.data.results);
        })
        .catch(function (error) {
          $log.error('XHR Failed for getPatientAdultFollowupEncounters: ' + error.data.error.message);
          return $q.reject(error);
        })
    }


    /**
     * @param {String} patientUuid Patient UUID.
     * @param {String} [v] Resouce reprentation.
     * @returns {Promise} Non retired pharmacy encounters for patient ordered by most recent.
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
        $log.error('XHR Failed for getPatientFilaEncounters: ' + error.data.error.message);
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

    function getEncountersOfPatient(patientUuid) {
      return $http.get(Bahmni.Common.Constants.encounterUrl, {
        params: {
          patient: patientUuid,
          v: "custom:(uuid,encounterType,encounterDatetime,provider,voided,visit:(uuid,startDatetime,stopDatetime),obs:(uuid,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value)))"
        },
        withCredentials: true
      });
    }

    function filterRetiredEncoounters(encounters) {
      return _.filter(encounters, function (encounter) {
        return !encounter.voided;
      });
    }
  }

})();
