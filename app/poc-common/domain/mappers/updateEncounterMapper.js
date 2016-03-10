'use strict';

Poc.Common.UpdateEncounterRequestMapper = (function () {
    function UpdateEncounterRequestMapper(currentDate) {
        this.currentDate = currentDate;
    }

    UpdateEncounterRequestMapper.prototype.mapFromFormPayload = function (formPayload, formParts, encounter) {
        
        var changedEncounter = changeEncounterValue(formPayload.form.fields,
                                encounter);
        var openMRSEncounter = {
            obs: changedEncounter.obs,
            uuid: changedEncounter.uuid
        };

        return  openMRSEncounter;
    };
    
    var changeEncounterValue = function (fields, encounter) {
        for (var key in fields) {
            var field = fields[key];
            //consider multiple selections
            if (field.fieldConcept.selectMultiple) {
                //find encounter obs for field concept
                var observations = _.filter(encounter.obs, function (data) {
                    return data.concept.uuid === field.fieldConcept.concept.uuid;
                });
                _.forEach(observations, function (obs) {
                    
                    if (field.value[obs.value.uuid] !== 'undefined') {
                        obs.concept = obs.concept.uuid;
                        obs.value = JSON.parse(field.value[obs.value.uuid]).uuid;
                        delete obs.groupMembers;
                    }
                });
                //find encounter obs for field concept
                var obs = _.find(encounter.obs, function (data) {
                    return data.concept.uuid === field.fieldConcept.concept.uuid;
                });
                
                //look for obs groupMember if not found previously
                if (typeof obs === 'undefined') {
                    _.forEach(encounter.obs, function (encObs) {
                        if(encObs.groupMembers) {
                            obs = _.find(encObs.groupMembers, function (data) {
                                return data.concept.uuid === field.fieldConcept.concept.uuid;
                            });
                            if (obs) {
                                obs.concept = obs.concept.uuid;
                                obs.value = isAnyObject(field.value) ? field.value.uuid: field.value;
                                delete obs.groupMembers;
                            }
                        }
                    });
                } else {
                   obs.concept = obs.concept.uuid;
                   obs.value = isAnyObject(field.value) ? field.value.uuid: field.value;
                   if (_.isEmpty(obs.groupMembers)) {
                       delete obs.groupMembers;
                   }
                }
            }
        };
        return encounter;
    };
    
    function isAnyObject(value) {
        return value != null && typeof value === 'object';
    }
    
    return UpdateEncounterRequestMapper;
    
})();