(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('formRequestMapper', formRequestMapper);

  formRequestMapper.$inject = [];

  /* @ngInject */
  function formRequestMapper() {
    var service = {
      mapFromOpenMRSForm: mapFromOpenMRSForm,
      mapFromOpenMRSFormWithEncounter: mapFromOpenMRSFormWithEncounter
    };
    return service;

    ////////////////

    function mapFromOpenMRSForm(givenForm) {
      var openMRSForm = angular.copy(givenForm);

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
    }

    function mapFromOpenMRSFormWithEncounter(openMRSForm, encounter) {
      var formPayload = this.mapFromOpenMRSForm(openMRSForm);
      formPayload.encounter = angular.copy(encounter);

      var filteredObs = filterObsWithoutGroups(encounter.obs);

      for (var field in formPayload.form.fields) {

        var eachField = formPayload.form.fields[field];

        eachField.value = undefined;

        //find obs for field
        _.forEach(filteredObs, function (obs) {
          //compare field concept with obs concept
          if (eachField.field.concept.uuid === obs.concept.uuid) {

            //multiple select filter
            if (eachField.field.selectMultiple) {

              if (angular.isUndefined(eachField.value)) {
                eachField.value = {};
              }

              if (_.isEmpty(eachField.field.concept.answers)) {
                eachField.value[obs.value.uuid] = obs.value;
              } else {
                eachField.value[obs.value.uuid]
                  = JSON.stringify(realValueOfField(eachField.field.concept.answers, obs.value));
              }


            } else if (!eachField.field.selectMultiple
              && eachField.field.concept.datatype.display === "Coded") {

              if (eachField.field.concept.answers.length === 0
                || eachField.field.concept.answers.length > 3) {
                eachField.value = realValueOfField(eachField.field.concept.answers, obs.value);
              } else {
                eachField.value = JSON.stringify(realValueOfField(eachField.field.concept.answers, obs.value));
              }

            } else {

              if (_.isEmpty(eachField.field.concept.answers)) {
                eachField.value = obs.value;
              } else {
                eachField.value = realValueOfField(eachField.field.concept.answers, obs.value);
              }

            }
          }

        });
      }

      return formPayload;
    }

    function createFormFields(formFields) {
      var fields = {};

      _.forEach(formFields, function (formField) {
        fields[formField.uuid] = {};
        fields[formField.uuid].field = {};
        fields[formField.uuid].field.name = formField.field.display;
        fields[formField.uuid].field.required = formField.required;
        fields[formField.uuid].field.fieldNumber = formField.fieldNumber;
        fields[formField.uuid].field.fieldPart = formField.fieldPart;
        fields[formField.uuid].field.maxOccurs = formField.maxOccurs;
        fields[formField.uuid].field.minOccurs = formField.minOccurs;
        fields[formField.uuid].field.pageNumber = formField.pageNumber;
        fields[formField.uuid].field.parent = formField.parent;
        fields[formField.uuid].field.uuid = formField.field.uuid;
        fields[formField.uuid].field.concept = formField.field.concept;
        fields[formField.uuid].field.fieldType = formField.field.fieldType;
        fields[formField.uuid].field.selectMultiple = formField.field.selectMultiple;
      });

      return fields;
    }

    function filterObsWithoutGroups(observations) {
      var plainObs = [];
      _.forEach(observations, function (obs) {
        if (obs.groupMembers) {
          plainObs = _.union(plainObs, obs.groupMembers);
        } else {
          plainObs.push(obs);
        }
      });
      return plainObs;
    }

    function filterOnlyConceptFields(fields) {
      return _.pickBy(fields, function (o) {
        return o.field.concept;
      });
    }

    function realValueOfField(conceptAnswers, obsValue) {
      return _.find(conceptAnswers, function (answer) {
        return answer.uuid === obsValue.uuid;
      });
    }


  }

})();
