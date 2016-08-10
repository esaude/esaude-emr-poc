'use strict';

Poc.Common.FormRequestMapper = (function () {
    
    var mapFromOpenMRSForm = function (openMRSForm) {
        var fields = filterOnlyConceptFields(openMRSForm.formFields);
        return {
            encounterType: openMRSForm.encounterType,
            form: {
                name: openMRSForm.display,
                description: openMRSForm.description,
                uuid: openMRSForm.uuid,
                fields: createFormFields(fields)
                
            }
        };
    };
    
    var filterOnlyConceptFields = function (fields) {
        return _.pickBy(fields, function (o) {
            return o.fieldConcept.concept;
        });
    };
    
    var mapFromOpenMRSFormWithEncounter = function (openMRSForm, encounter) {
        var formPayload = this.mapFromOpenMRSForm(openMRSForm);
        formPayload.encounter = encounter;
        
        var filteredObs = filterObsWithoutGroups(encounter.obs);
        
        for (var field in formPayload.form.fields) {
            var eachField = formPayload.form.fields[field];
            eachField.value = undefined;
            //find obs for field
            _.forEach(filteredObs, function (obs) {
                //compare field concept with obs concept
                if(eachField.fieldConcept.concept.uuid === obs.concept.uuid) {
                    
                    //multiple select filter
                    if (eachField.fieldConcept.selectMultiple) {
                        eachField.value = {};
                        
                        eachField.value[obs.value.uuid] = (_.isEmpty(eachField.fieldConcept.concept.answers)) ? 
                                obs.value : 
                                        JSON.stringify(realValueOfField(eachField.fieldConcept.concept.answers, obs.value));
                    }
                    else if (eachField.fieldConcept.concept.answers.length === 2 && isTrueFalseQuestion(eachField.fieldConcept.concept.answers)) {
                        eachField.value = JSON.stringify(realValueOfField(eachField.fieldConcept.concept.answers, obs.value));
                    } else {
                        eachField.value = (_.isEmpty(eachField.fieldConcept.concept.answers)) ? 
                                obs.value : 
                                        realValueOfField(eachField.fieldConcept.concept.answers, obs.value);
                    }
                }

            });
        }
        return formPayload;
    };
    
    var isTrueFalseQuestion = function (question) {
        var found = _.find(question, function (answer) {
            return answer.uuid === "e1d81b62-1d5f-11e0-b929-000c29ad1d07" || 
                    answer.uuid === "e1d81c70-1d5f-11e0-b929-000c29ad1d07";
        });
        return typeof found !== "undefined";
    };
    
    var realValueOfField = function (conceptAnswers, obsValue) {
        return _.find(conceptAnswers, function (answer) {
            return answer.uuid === obsValue.uuid;
        });
    };
    
    var filterObsWithoutGroups = function (observations) {
        var plainObs = [];
        _.forEach(observations, function (obs) {
            if (obs.groupMembers !== null) {
                plainObs = _.union(plainObs, obs.groupMembers);
            } else {
                plainObs.push(obs);
            }     
        });
        return plainObs;
    };
    
    var createFormFields = function (formFields) {
        var fields = [];

        _.forEach(formFields, function (formField) {
            fields[formField.uuid] = {};
            fields[formField.uuid].field = {};
            fields[formField.uuid].field.name = formField.field.display,
            fields[formField.uuid].field.required = formField.required,
            fields[formField.uuid].field.fieldNumber = formField.fieldNumber,
            fields[formField.uuid].field.fieldPart = formField.fieldPart,
            fields[formField.uuid].field.maxOccurs = formField.maxOccurs,
            fields[formField.uuid].field.minOccurs = formField.minOccurs,
            fields[formField.uuid].field.pageNumber = formField.pageNumber,
            fields[formField.uuid].field.parent = formField.parent,
            fields[formField.uuid].field.uuid = formField.field.uuid,
            fields[formField.uuid].fieldConcept = formField.fieldConcept;
        });    
        return fields;
    };

    return {
        mapFromOpenMRSForm: mapFromOpenMRSForm,
        mapFromOpenMRSFormWithEncounter: mapFromOpenMRSFormWithEncounter
    };
})();
