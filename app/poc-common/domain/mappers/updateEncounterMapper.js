'use strict';

Poc.Common.UpdateEncounterRequestMapper = (function () {
    function UpdateEncounterRequestMapper(currentDate) {
        this.currentDate = currentDate;
    }

    UpdateEncounterRequestMapper.prototype.mapFromFormPayload = function (formPayload, formParts, encounter) {
        
        encounter.obs = createObs(formPayload.form.fields, flattenFields(formParts), encounter)

        return  encounter;
    };
    
    var flattenFields = function (formParts) {
        var flatten = [];
        _.forEach(formParts, function (part) {
            var fields = _.map(part.fields, "id");
            flatten = _.union(flatten, fields);
        });
        return flatten;
    };
    
    var createObsGroups = function (fields, flattenFields, encounter) {
        var obsBroups = [];
        for (var key in fields) {
            var field = fields[key];
            
            //find encounter obs for field concept
            var obs = _.find(encounter.obs, function (data) {
                return data.concept.uuid === field.fieldConcept.concept.uuid;
            });
            //in case the field concept is a set, 
            //in case not found, look inside group members
            //check if field is a concept set
            if (field.fieldConcept.concept.set) {
                var obs = {
                    concept: field.fieldConcept.concept.uuid,
                    obsDatetime: Bahmni.Common.Util.DateUtil.now(),
                    person: person,
                    groupMembers: []
                    
                };
                _.forEach(field.fieldConcept.concept.setMembers, function (member) {
                    var memberFieldUuid = _.findKey(fields, function(data) {
                        return data.fieldConcept.concept.uuid === member.uuid;
                    });
                    
                    var removedMemberField = _.remove(flattenFields, function (data) {
                        return data === memberFieldUuid;
                    });
                    //set the member if removed
                    if (!_.isEmpty(removedMemberField)) {
                        var memberField = fields[removedMemberField[0]];
                        if (memberField.value !== 'undefined' && memberField.value != null) {
                            //to accomodate multiple select
                            if (memberField.fieldConcept.selectMultiple) {
                                _.forEach(memberField.fieldConcept.concept.answers, function (answer) {
                                    var answerValue = memberField.value[answer.uuid];
                                    if (answerValue !== 'undefined' && answerValue != null) {
                                        obs.groupMembers.push({
                                            concept: memberField.fieldConcept.concept.uuid,
                                            value: JSON.parse(answerValue).uuid,
                                            obsDatetime: Bahmni.Common.Util.DateUtil.now(),
                                            person: person
                                        });
                                    }
                                });
                            } else {
                                obs.groupMembers.push({
                                    concept: memberField.fieldConcept.concept.uuid,
                                    value: (isAnyObject(memberField.value) &&
                                            memberField.fieldConcept.concept.datatype.display === 'Coded') ? memberField.value.uuid : memberField.value,
                                    obsDatetime: Bahmni.Common.Util.DateUtil.now(),
                                    person: person
                                });
                            }
                        }
                    }
                });
                //add to collection if group has any member
                if (!_.isEmpty(obs.groupMembers)) {
                    obsBroups.push(obs);
                }
            }
        };
        return obsBroups;
    };
    
    var createNonObsGroups = function (fields, flattenFields, person) {
        var obs = [];
        _.forEach(flattenFields, function (field) {
            var formField = fields[field];
            if (formField.value !== 'undefined' && formField.value != null) {
                //to accomodate multiple select
                if (formField.fieldConcept.selectMultiple) {
                    _.forEach(formField.fieldConcept.concept.answers, function (answer) {
                        var answerValue = formField.value[answer.uuid];
                        if (answerValue !== 'undefined' && answerValue != null) {
                            obs.push({
                                concept: formField.fieldConcept.concept.uuid,
                                value: JSON.parse(answerValue).uuid,
                                obsDatetime: Bahmni.Common.Util.DateUtil.now(),
                                person: person
                            });
                        }
                    });
                } else {
                    obs.push({
                        concept: formField.fieldConcept.concept.uuid,
                        value: (isAnyObject(formField.value) &&
                                formField.fieldConcept.concept.datatype.display === 'Coded') ? formField.value.uuid : formField.value,
                        obsDatetime: Bahmni.Common.Util.DateUtil.now(),
                        person: person
                    });
                }
            }
        });
        return obs;
    };
    
    var createObs = function (fields, flattenFields, person) {
        return _.union(createObsGroups(fields, flattenFields, person), 
        createNonObsGroups(fields, flattenFields, person));
    };

    function isAnyObject(value) {
        return value != null && typeof value === 'object';
    }

    return CreateEncounterRequestMapper;
})();