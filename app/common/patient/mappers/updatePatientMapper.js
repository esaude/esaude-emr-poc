(() => {
  'use strict';

  angular
    .module('common.patient')
    .factory('updatePatientMapper', updatePatientMapper);

  updatePatientMapper.$inject = [];

  /* @ngInject */
  function updatePatientMapper() {
    var DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
    var service = {
      map: map
    };
    return service;

    ////////////////

    function map(patientAttributeTypes, openMRSPatient, patient, currentDate) {
      var dateUtil = Bahmni.Common.Util.DateUtil;
      var openMRSPatientProfile = {
        patient: {
          person: {
            names: [
              {
                uuid: openMRSPatient.person.names[0].uuid,
                givenName: patient.givenName,
                middleName: patient.middleName,
                familyName: patient.familyName,
                "preferred": true
              }
            ],
            addresses: [_.pick(patient.address, Bahmni.Registration.Constants.allAddressFileds)],
            birthdate: getBirthdate(dateUtil.getDateStr(patient.birthdate), patient.age, currentDate),
            birthdateEstimated: patient.birthdate === undefined || patient.birthdate === "",
            gender: patient.gender,
            attributes: getMrsAttributes(openMRSPatient, patient, patientAttributeTypes),
            dead: patient.dead,
            causeOfDeath: (patient.dead === true) ? patient.causeOfDeath.uuid : null,
            deathDate: (patient.dead === true) ? patient.deathDate : null
          }
        }
      };

      openMRSPatientProfile.patient.identifiers = _.map(patient.identifiers, identifier => ({
        uuid: identifier.uuid,
        identifier: identifier.identifier,
        identifierType: identifier.identifierType.uuid,
        preferred: identifier.preferred,
        voided: identifier.voided
      }));

      // Identifiers not in given patient
      var voidedIdentifiers = openMRSPatient.identifiers.filter(i => !patient.identifiers.find(pi => i.uuid === pi.uuid));

      // Identifiers not in openMRS patient
      var addedIdentifiers = patient.identifiers.filter(i => !openMRSPatient.identifiers.find(pi => i.uuid === pi.uuid));

      // Identifiers in given patient that were modified
      var changedIdentifiers = patient.identifiers.filter(actualId => {
        var oldId = openMRSPatient.identifiers.find(oldIdentifier => actualId.identifierType.uuid === oldIdentifier.identifierType.uuid);
        return oldId && (oldId.identifier !== actualId.identifier || oldId.preferred !== actualId.preferred);
      });

      openMRSPatientProfile.relationships = patient.relationships;

      return {
        patient: openMRSPatientProfile,
        voidedIdentifiers: voidedIdentifiers,
        changedIdentifiers: changedIdentifiers,
        addedIdentifiers: addedIdentifiers
      };
    }

    function getBirthdate(birthdate, age, currentDate) {
      var mnt;
      if (birthdate !== undefined && birthdate !== "") {
        mnt = moment(birthdate, 'DD-MM-YYYY');
      } else if (age !== undefined) {
        mnt = moment(currentDate).subtract('days', age.days).subtract('months', age.months).subtract('years', age.years);
      }
      return mnt.format('YYYY-MM-DD');
    }

    function getMrsAttributes(openMRSPatient, patient, patientAttributeTypes) {
      var attributes = [];
      patientAttributeTypes.forEach(attributeType => {
        var attr = {
          attributeType: {
            uuid: attributeType.uuid
          }
        };
        var savedAttribute = openMRSPatient.person.attributes.filter(attribute => attributeType.uuid === attribute.attributeType.uuid)[0];

        if (savedAttribute) {
          attr.uuid = savedAttribute.uuid;
          setAttributeValue(attributeType, attr, patient[savedAttribute.attributeType.display]);
        } else {
          setAttributeValue(attributeType, attr, patient[attributeType.name]);
        }
        attributes.push(attr);
      });
      return attributes;
    }

    function setAttributeValue(attributeType, attr, value) {
      if (attributeType.format === "org.openmrs.Concept") {
        attr.hydratedObject = value;
      } else if (attributeType.format === "org.openmrs.util.AttributableDate") {
        attr.value = moment(value).format(DATETIME_FORMAT);
      } else if (value === "" || value === null || value === undefined) {
        attr.voided = true;
      } else {
        attr.value = value.toString();
      }
    }


  }

})();
