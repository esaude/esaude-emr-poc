'use strict';

Poc.Common.UpdateEncounterRequestMapper = (function () {
    function UpdateEncounterRequestMapper(currentDate) {
        this.currentDate = currentDate;
    }

    UpdateEncounterRequestMapper.prototype.mapFromFormPayload = function (formPayload, formParts, encounter) {
        
        var changedEncounter = changeEncounterValue(formPayload.form.fields, 
                                flattenFields(formParts), 
                                encounter);
                                debugger
        var openMRSEncounter = {
            obs: changedEncounter.obs,
            uuid: changedEncounter.uuid
        };

        return  openMRSEncounter;
    };
    
    var flattenFields = function (formParts) {
        var flatten = [];
        _.forEach(formParts, function (part) {
            var fields = _.map(part.fields, "id");
            flatten = _.union(flatten, fields);
        });
        return flatten;
    };
    
    var changeEncounterValue = function (fields, flattenFields, encounter) {
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
                console.log(field);
                console.log(obs);
                console.log("-------------------------------------------------");
            } else {
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
                console.log(field);
                console.log(obs);
                console.log("-------------------------------------------------");
            }
        };
        return encounter;
            
//        _.forEach(encounter.obs, function (encObs) {
//            //find field concept for obs concept
//            for (var key in fields) {
//                var field = fields[key];
//                var obs;
//                
//                if (field.fieldConcept.concept.uuid === encObs.concept.uuid) {
//                    obs = encObs;
//                } else  {
//                    //check if obs has any member
//                    if (encObs.groupMembers !== null) {
//                        obs = _.find(encObs.groupMembers, function (data) {
//                            data.concept.uuid = field.fieldConcept.concept.uuid;
//                        }); 
//                    }
//                }
//                //in case the obs was found
//                if (typeof obs !== 'undefined') {
//                    //whether or not the field is select multiple
//                    if (field.fieldConcept.selectMultiple) {
//                        obs.value = JSON.parse(field.value[obs.value.uuid]).uuid;
//                    } else {
//                        obs.value = isAnyObject(field.value) ? field.value.uuid: field.value;
//                    }
//                }
//                debugger
//            };
//        });
//            //in case the field concept is a set, 
//            //in case not found, look inside group members
//            //check if field is a concept set
//            if (field.fieldConcept.concept.set) {
//                var obs = {
//                    concept: field.fieldConcept.concept.uuid,
//                    obsDatetime: Bahmni.Common.Util.DateUtil.now(),
//                    person: person,
//                    groupMembers: []
//                    
//                };
//                _.forEach(field.fieldConcept.concept.setMembers, function (member) {
//                    var memberFieldUuid = _.findKey(fields, function(data) {
//                        return data.fieldConcept.concept.uuid === member.uuid;
//                    });
//                    
//                    var removedMemberField = _.remove(flattenFields, function (data) {
//                        return data === memberFieldUuid;
//                    });
//                    //set the member if removed
//                    if (!_.isEmpty(removedMemberField)) {
//                        var memberField = fields[removedMemberField[0]];
//                        if (memberField.value !== 'undefined' && memberField.value != null) {
//                            //to accomodate multiple select
//                            if (memberField.fieldConcept.selectMultiple) {
//                                _.forEach(memberField.fieldConcept.concept.answers, function (answer) {
//                                    var answerValue = memberField.value[answer.uuid];
//                                    if (answerValue !== 'undefined' && answerValue != null) {
//                                        obs.groupMembers.push({
//                                            concept: memberField.fieldConcept.concept.uuid,
//                                            value: JSON.parse(answerValue).uuid,
//                                            obsDatetime: Bahmni.Common.Util.DateUtil.now(),
//                                            person: person
//                                        });
//                                    }
//                                });
//                            } else {
//                                obs.groupMembers.push({
//                                    concept: memberField.fieldConcept.concept.uuid,
//                                    value: (isAnyObject(memberField.value) &&
//                                            memberField.fieldConcept.concept.datatype.display === 'Coded') ? memberField.value.uuid : memberField.value,
//                                    obsDatetime: Bahmni.Common.Util.DateUtil.now(),
//                                    person: person
//                                });
//                            }
//                        }
//                    }
//                });
//                //add to collection if group has any member
//                if (!_.isEmpty(obs.groupMembers)) {
//                    obsBroups.push(obs);
//                }
//            }
//        };
//        return obsBroups;
    };
    
    function isAnyObject(value) {
        return value != null && typeof value === 'object';
    }
    
    return UpdateEncounterRequestMapper;
    
})();