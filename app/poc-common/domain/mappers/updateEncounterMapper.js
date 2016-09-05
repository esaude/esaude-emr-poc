'use strict';

Poc.Common.UpdateEncounterRequestMapper = (function () {
    function UpdateEncounterRequestMapper(currentDate) {
        this.currentDate = currentDate;
    }

    UpdateEncounterRequestMapper.prototype.mapFromFormPayload = function (newEncounter, oldEncounter) {
        var encounter = {
            uuid: oldEncounter.uuid,
            obs: []
        };
        findExistingObs(newEncounter.obs, oldEncounter.obs, encounter.obs);
        return encounter;
    };
    
    var findExistingObs = function (nObservations, oObservations, bObservations) {
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
    };
    
    return UpdateEncounterRequestMapper;
    
})();