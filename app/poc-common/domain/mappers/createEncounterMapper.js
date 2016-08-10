'use strict';

Poc.Common.CreateEncounterRequestMapper = (function () {
    function CreateEncounterRequestMapper(currentDate) {
        this.currentDate = currentDate;
    }

    CreateEncounterRequestMapper.prototype.mapFromFormPayload = function (formPayload, formParts, patient, location, provider) {
        var fields = filterOnlyConceptFields(formPayload.form.fields);
        var openMRSEncounter = {
            encounterType: formPayload.encounterType.uuid,
            encounterDatetime: this.currentDate,
            patient: patient,
            location: location,
            form: formPayload.form.uuid,
            provider: provider,
            obs: createObs(fields, flattenFields(formParts), patient)
        };

        return  openMRSEncounter;
    };
    
    var filterOnlyConceptFields = function (fields) {
        return _.pickBy(fields, function (o) {
            return o.fieldConcept.concept;
        });
    };
    
    var flattenFields = function (formParts) {
        var flatten = [];
        _.forEach(formParts, function (part) {
            var fields = _.map(part.fields, "id");
            flatten = _.union(flatten, fields);
        });
        return flatten;
    };
    
    var createObsGroups = function (fields, flattenFields, person) {
        var obsBroups = [];
        for (var key in fields) {
            var field = fields[key];
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
                        if (memberField.value !== 'undefined' && memberField.value !== null) {
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
                                var value;                       
                                if(memberField.fieldConcept.concept.datatype.display === 'Coded') {
                                    if(_.isString(memberField.value)) {
                                        value = JSON.parse(memberField.value).uuid;
                                    } else {
                                        value = memberField.value.uuid;
                                    }
                                } else {
                                    value = memberField.value;
                                }
                                //only if obs has value
                                if(typeof value !== 'undefined') {
                                    obs.groupMembers.push({
                                        concept: memberField.fieldConcept.concept.uuid,
                                        value: value,
                                        obsDatetime: Bahmni.Common.Util.DateUtil.now(),
                                        person: person
                                    });
                                }
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