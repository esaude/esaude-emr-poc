'use strict';

Poc.Common.CreateEncounterRequestMapper = (function () {
    function CreateEncounterRequestMapper(currentDate) {
        this.currentDate = currentDate;
    }

    CreateEncounterRequestMapper.prototype.mapFromFormPayload = function (formPayload, formParts, patient, location, provider) {
        
        createObsGroups(formPayload.form.fields, flattenFields(formParts));
        
        var openMRSEncounter = {
            encounterType: formPayload.encounterType.uuid,
            encounterDatetime: this.currentDate,
            patient: patient,
            location: location,
            form: formPayload.form.uuid,
            provider: provider,
            obs: createObs(formPayload.form.fields, formParts, patient, this.currentDate)
        };

        return  openMRSEncounter;
    };
    
    var createObs = function (fields, fornParts, patient, currentDate) {
        var obs = [];
        _.forEach(fornParts, function (part) {
            _.forEach(part.fields, function (field) {
                var formField = fields[field.id];
                if (formField.value !== 'undefined' && formField.value != null) {
                    obs.push({
                        concept: formField.fieldConcept.concept.uuid,
                        value: (isAnyObject(formField.value) &&
                                formField.fieldConcept.concept.datatype.display === 'Coded') ? formField.value.uuid : formField.value,
                        obsDatetime: currentDate,
                        person: patient
                    });
                }
            });
        });
        return obs;
    };
    
    var flattenFields = function (formParts) {
        var flatten = [];
        _.forEach(formParts, function (part) {
            var fields = _.map(part.fields, "id");
            flatten = _.union(flatten, fields);
        });
        return flatten;
    };
    
    var createObsGroups = function (fields, flattenFields) {
        var obs = {};
        for (var key in fields) {
            var field = fields[key];
            //check if field is a concept set
            if (field.fieldConcept.concept.set) {
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
                        console.log(memberField);
                    }
                });
            }
        };
    };
    
    var findFieldByConcept = function (fields, conceptUuid) {
        var fieldsArray = _.map(fields, function (field) {
            return field;
        });
        
        console.log(fieldsArray);

//        return _.find(fields, function (field) {
//            return field.fieldConcept.concept.uuid === conceptUuid;
//        })
    }

    function isAnyObject(value) {
        return value != null && typeof value === 'object';
    }

    return CreateEncounterRequestMapper;
})();