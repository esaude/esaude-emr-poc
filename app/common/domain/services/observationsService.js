(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('observationsService', observationService);

  observationService.$inject = ['$http', '$log', '$q'];

  /* @ngInject */
  function observationService($http, $log, $q) {
    var OPENMRS_OBS_REST_URL = Poc.Patient.Constants.obsRestUrl ;

    var service = {
      findAll: findAll,
      filterByList: filterByList,
      filterRetiredObs: filterRetiredObs,
      getObs: getObs,
      getLastValueForConcept: getLastValueForConcept,
      filterLastPatientVitalsObs: filterLastPatientVitalsObs
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

    function getObs(patientUuid, concept) {
      return $http.get(OPENMRS_OBS_REST_URL, {
        params: {
          patient: patientUuid,
          concept: concept,
          v: "custom:(uuid,display,encounter:(encounterDatetime,encounterType,provider:(display,uuid)),voided,concept:(uuid,name),obsDatetime,value,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value))"
        },
        withCredentials: true
      });
    }

    function getLastValueForConcept(patientUUID, concept) {
      return getObs(patientUUID, concept)
        .then(function (response) {

          var nonRetired = filterRetiredObs(response.data.results);

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

    function filterLastPatientVitalsObs(patientUuid, concepts) {
        return getObs(patientUuid, concepts).then(function(response) {
            var nonRetired = filterRetiredObs(response.data.results);
                return _.maxBy(nonRetired, 'obsDatetime');
          }).catch(function (error) {
              $q.reject(error);
          });
      }

  }

})();
