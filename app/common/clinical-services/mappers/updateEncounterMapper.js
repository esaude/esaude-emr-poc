(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('updateEncounterMapper', updateEncounterMapper);

  updateEncounterMapper.$inject = [];

  /* @ngInject */
  function updateEncounterMapper() {
    var mapper = {
      mapFromFormPayload: mapFromFormPayload
    };
    return mapper;

    ////////////////

    function mapFromFormPayload(newEncounter, oldEncounter) {
      var encounter = {
        uuid: oldEncounter.uuid,
        obs: []
      };
      findExistingObs(newEncounter.obs, oldEncounter.obs, encounter.obs);
      return encounter;
    }

    function findExistingObs(nObservations, oObservations, bObservations) {
      //find new things to add, comparing to old
      _.forEach(nObservations, function (newObs) {
        //brand new obs
        var obs = {
          person: newObs.person,
          obsDatetime: newObs.obsDatetime,
          concept: newObs.concept
        };
        //find existing
        var foundObs = _.find(oObservations, function (oldObs) {
          return oldObs.concept.uuid === newObs.concept;
        });
        if (foundObs) {
          obs.uuid = foundObs.uuid;
          //must loock for menber if obs is a group
          if (!_.isEmpty(newObs.groupMembers)) {
            obs.groupMembers = [];
            findExistingObs(newObs.groupMembers, foundObs.groupMembers, obs.groupMembers);
          }
        }
        obs.value = newObs.value;
        bObservations.push(obs);
      });
    }
  }

})();
