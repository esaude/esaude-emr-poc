'use strict';

Poc.Common.FormRequestMapper = (function () {
    
    var mapFromOpenMRSForm = function (openMRSForm) {        
        var service = {
            encounterType: openMRSForm.encounterType,
            form: {
                name: openMRSForm.display,
                description: openMRSForm.description,
                uuid: openMRSForm.uuid,
                fields: createFormFields(openMRSForm.formFields)
                
            }
        };
        
        return  service;
    };
    
    var createFormFields = function (formFields) {
        var fields = [];

        _.forEach(formFields, function (formField) {
            fields[formField.uuid] = {};
            fields[formField.uuid].field = {};
            fields[formField.uuid].field.name = formField.field.display,
            fields[formField.uuid].field.required = formField.field.required,
            fields[formField.uuid].field.fieldNumber = formField.field.fieldNumber,
            fields[formField.uuid].field.fieldPart = formField.field.fieldPart,
            fields[formField.uuid].field.maxOccurs = formField.field.maxOccurs,
            fields[formField.uuid].field.minOccurs = formField.field.minOccurs,
            fields[formField.uuid].field.pageNumber = formField.field.pageNumber,
            fields[formField.uuid].field.parent = formField.field.parent,
            fields[formField.uuid].field.uuid = formField.field.uuid,
            formField.fieldConcept.success(function (data) {
                fields[formField.uuid].fieldConcept = data;
            })
        });    
        return fields;
    };

    return {
        mapFromOpenMRSForm: mapFromOpenMRSForm
    };
})();
