(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('clinicalServicesFormMapper', clinicalServicesFormMapper);

  clinicalServicesFormMapper.$inject = [];

  /* @ngInject */
  function clinicalServicesFormMapper() {
    var service = {
      map: map
    };
    return service;

    ////////////////

    function mapForm(givenForm) {
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

    function map(clinicalService, encounter) {

      var formPayload = mapForm(clinicalService.form);

      if (!encounter) {
        return formPayload;
      }

      formPayload.encounter = angular.copy(encounter);

      var filteredObs = filterObsWithoutGroups(encounter.obs);

      Object.getOwnPropertyNames(formPayload.form.fields).forEach(function (formFieldUUID) {

        var formField = formPayload.form.fields[formFieldUUID];

        var obs = filteredObs.filter(function (obs) {
          return formField.field.concept.uuid === obs.concept.uuid;
        });

        obs.forEach(function (obs) {

          if (formField.field.selectMultiple) {

            handleSelectMultipleField(formField, obs);

          } else if (formField.field.concept.datatype.display === "Coded") {

            if (isSearchBySourceField(clinicalService, formFieldUUID)) {

              handleSearchBySourceField(formPayload.form.fields, formField, obs);

            } else {

              handleCodedField(formField, obs);
            }

          } else {

            handleNormalConceptField(formField, obs);

          }
        });
      });

      return formPayload;
    }

    function handleSelectMultipleField(formField, obs) {
      if (!formField.value) {
        formField.value = {};
      }

      var conceptAnswers = formField.field.concept.answers;

      if (_.isEmpty(conceptAnswers)) {
        formField.value[obs.value.uuid] = obs.value;
      } else {
        formField.value[obs.value.uuid]
          = JSON.stringify(realValueOfField(conceptAnswers, obs.value));
      }
    }

    function handleCodedField(formField, obs) {
      var conceptAnswers = formField.field.concept.answers;
      if (conceptAnswers.length === 0 || conceptAnswers.length > 3) {
        formField.value = realValueOfField(conceptAnswers, obs.value);
      } else {
        formField.value = JSON.stringify(realValueOfField(conceptAnswers, obs.value));
      }
    }

    function handleNormalConceptField(formField, obs) {
      var conceptAnswers = formField.field.concept.answers;
      if (_.isEmpty(conceptAnswers)) {
        if (formField.field.concept.datatype.display === 'Date') {
          formField.value = new Date(obs.value);
        } else {
          formField.value = obs.value;
        }
      } else {
        formField.value = realValueOfField(conceptAnswers, obs.value);
      }
    }

    function handleSearchBySourceField(allFields, formField, obs) {
      // See if the value for this obs was already used for the value of another field.
      // This is necessary because for fields with searchBySource there is no link between the obs value and the field
      // that originated it, if we have two fields associated with the same concept we cannot know from which field the
      // obs value originated.
      // Even with this workaround depending on the order of the obs its possible that the values are associated with
      // the wrong field.
      var alreadyUsed = Object.getOwnPropertyNames(allFields).find(function (f) {
        var formField = allFields[f];
        if (formField.value) {
          return formField.value.uuid === obs.value.uuid;
        }
      });

      if (!alreadyUsed) {
        formField.value = obs.value;
      }
    }

    function isSearchBySourceField(clinicalService, formFieldUUID) {
      var found = clinicalService.formLayout.parts
        .reduce(function (acc, curr) {
          return acc.concat(curr.fields);
        }, [])
        .find(function (f) {
          return f.id === formFieldUUID;
        });
      return found && angular.isDefined(found.searchBySource);
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
