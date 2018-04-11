(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('observationsService', observationService);

  observationService.$inject = ['$http', '$log', '$q'];

  /* @ngInject */
  function observationService($http, $log, $q) {
    var OPENMRS_OBS_REST_URL = Poc.Patient.Constants.obsRestUrl;

    var service = {
      findAll: findAll,
      filterByList: filterByList,
      filterRetiredObs: filterRetiredObs,
      getObs: getObs,
      getLastValueForConcept: getLastValueForConcept,
      getLastPatientObs: getLastPatientObs
    };
    return service;

    ////////////////

    function findAll(patientUuid) {
      return $http.get(OPENMRS_OBS_REST_URL, {
        params: {
          patient: patientUuid,
          v: "custom:(uuid,display,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value))"
        },
        withCredentials: true
      });
    }

    function getObs(patientUuid, conceptUuid) {
      return $http.get(OPENMRS_OBS_REST_URL, {
        params: {
          patient: patientUuid,
          concept: conceptUuid,
          v: "custom:(uuid,display,encounter:(encounterDatetime,encounterType,provider:(display,uuid)),voided,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value))"
        },
        withCredentials: true
      }).then(function (response) {
        return response.data.results;
      }).catch(function (error) {
        $log.error('XHR Failed for getObs: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function getLastValueForConcept(patientUUID, concept) {
      return getObs(patientUUID, concept)
        .then(function (obs) {

          var nonRetired = filterRetiredObs(obs);

          if (!_.isEmpty(nonRetired)) {
            var last = _.maxBy(nonRetired, 'obsDatetime');
            if (last.value.datatype && last.value.datatype.display === "Coded") {
              return _.find(concept.answers, function (answer) {
                return answer.uuid === last.value.uuid;
              });
            }
            return last.value;
          }
        })
        .catch(function (error) {
          $log.error('XHR Failed for getLastValueForConcept: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function filterRetiredObs(observations) {
      return _.filter(observations, function (obs) {
        return !obs.voided;
      });
    }

    function filterByList(obsList, concepts) {
      var filtered = _.filter(obsList, function (data) {
        return _.includes(concepts, data.concept.uuid);
      });
      //find inside groups
      if (_.isEmpty(filtered)) {
        _.forEach(obsList, function (data) {
          if (data.groupMembers !== null) {
            var groupFiltered = _.filter(data.groupMembers, function (member) {
              return _.includes(concepts, member.concept.uuid);
            });
            if (!_.isEmpty(groupFiltered)) {
              filtered = _.union(filtered, groupFiltered);
            }
          }
        });
      }
      return filtered;
    }

    /**
     * @param {Object} patient
     * @param {Object} concept
     * @param {String} [representation=default]
     * @return {Promise<Object>} The last obs with given concept for the patient.
     */
    function getLastPatientObs(patient, concept, representation) {
      var params = {
        patient: patient.uuid,
        concept: concept.uuid,
        limit: 1,
        startIndex: 0,
        v: representation
      };
      return $http.get(OPENMRS_OBS_REST_URL, {params: params})
        .then(function (response) {
          return response.data.results[0];
        })
        .catch(function (error) {
          $log.error('XHR Failed for getLastPatientObs: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

  }

})();
