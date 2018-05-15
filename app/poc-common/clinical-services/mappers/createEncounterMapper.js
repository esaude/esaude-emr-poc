(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('createEncounterMapper', createEncounterMapper);

  createEncounterMapper.$inject = [];

  /* @ngInject */
  function createEncounterMapper() {

    var CODED_DATATYPE = 'Coded';

    var DATE_DATATYPE = 'Date';

    var DATETIME_DATATYPE = 'Datetime';

    var DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

    var mapper = {
      mapFromFormPayload: mapFromFormPayload
    };
    return mapper;

    ////////////////

    function mapFromFormPayload(formPayload, formParts, patient, location, provider) {
      var fields = filterOnlyConceptFields(formPayload.form.fields);
      var openMRSEncounter = {
        encounterType: formPayload.encounterType.uuid,
        patient: patient,
        location: location,
        form: formPayload.form.uuid,
        provider: provider,
        obs: createObs(fields, flattenFields(formParts), patient)
      };

      return openMRSEncounter;
    }

    function filterOnlyConceptFields(fields) {
      return _.pickBy(fields, function (o) {
        return o.field.concept;
      });
    }

    function flattenFields(formParts) {
      var flatten = [];
      _.forEach(formParts, function (part) {
        var fields = _.map(part.fields, "id");
        flatten = _.union(flatten, fields);
      });
      return flatten;
    }

    function createObsGroups(fields, flattenFields, person) {
      var obsBroups = [];

      for (var key in fields) {
        var field = fields[key];
        //check if field is a concept set
        if (field.field.concept.set) {
          var obs = {
            concept: field.field.concept.uuid,
            person: person,
            groupMembers: []

          };
          _.forEach(field.field.concept.setMembers, function (member) {
            var memberFieldUuid = _.findKey(fields, function (data) {
              return data.field.concept.uuid === member.uuid;
            });
            var removedMemberField = _.remove(flattenFields, function (data) {
              return data === memberFieldUuid;
            });
            //set the member if removed
            if (!_.isEmpty(removedMemberField)) {
              var memberField = fields[removedMemberField[0]];
              if (typeof memberField.value !== 'undefined' && memberField.value !== null) {
                //to accomodate multiple select
                if (memberField.field.selectMultiple) {
                  _.forEach(memberField.field.concept.answers, function (answer) {
                    var answerValue = memberField.value[answer.uuid];
                    if (answerValue !== 'undefined' && answerValue != null) {
                      obs.groupMembers.push({
                        concept: memberField.field.concept.uuid,
                        value: JSON.parse(answerValue).uuid,
                        person: person
                      });
                    }
                  });
                } else {
                  var value;
                  if (memberField.field.concept.datatype.display === 'Coded') {
                    if (_.isString(memberField.value)) {
                      value = JSON.parse(memberField.value).uuid;
                    } else {
                      value = memberField.value.uuid;
                    }
                  } else {
                    value = memberField.value;
                  }
                  //only if obs has value
                  if (typeof value !== 'undefined') {
                    obs.groupMembers.push({
                      concept: memberField.field.concept.uuid,
                      value: value,
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
      }
      return obsBroups;
    }


    function getNonSelectMultipleObsValue(formField) {
      var value = formField.value;
      var dataType = formField.field.concept.datatype.display;
      if (isAnyObject(value)) {
        if (dataType === CODED_DATATYPE) {
          value = ensureObject(formField.value).uuid;
        } else if (dataType === DATE_DATATYPE || dataType === DATETIME_DATATYPE) {
          value = moment(value).format(DATETIME_FORMAT);
        }
      }
      return value;
    }

    function createNonObsGroups(fields, flattenFields, person) {
      var obs = [];
      _.forEach(flattenFields, function (field) {
        var formField = fields[field];
        if (typeof formField.value !== 'undefined' && formField.value != null) {
          //to accomodate multiple select
          if (formField.field.selectMultiple) {
            _.forEach(formField.field.concept.answers, function (answer) {
              var answerValue = formField.value[answer.uuid];
              if (answerValue !== 'undefined' && answerValue != null) {
                obs.push({
                  concept: formField.field.concept.uuid,
                  value: JSON.parse(answerValue).uuid,
                  person: person
                });
              }
            });
          } else {
            obs.push({
              concept: formField.field.concept.uuid,
              value: getNonSelectMultipleObsValue(formField),
              person: person
            });
          }
        }
      });
      return obs;
    }

    function createObs(fields, flattenFields, person) {
      return _.union(createObsGroups(fields, flattenFields, person),
        createNonObsGroups(fields, flattenFields, person));
    }

    function isAnyObject(value) {
      var isObj;

      if (value !== null && value !== undefined && typeof value === 'object') {
        return true;
      } else if (typeof value === 'string') {
        try {
          isObj = JSON.parse(value);

          return typeof isObj === 'object';
        } catch (err) {
          return false;
        }
      }
    }

    function ensureObject(value) {
      var isObj;

      if (typeof value === 'object') {
        return value;
      } else if (typeof value === 'string') {
        try {
          isObj = JSON.parse(value);

          if (typeof isObj === 'object') {
            return isObj;
          } else {
            return null;
          }
        } catch (err) {
          return null;
        }
      }
    }

  }
})();
