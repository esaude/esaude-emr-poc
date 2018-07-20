(() => {
  'use strict';

  angular
    .module('common.patient')
    .factory('openmrsPatientMapper', openmrsPatientMapper);

  openmrsPatientMapper.$inject = ['patient', '$rootScope', 'age'];

  /* @ngInject */
  function openmrsPatientMapper(patientModel, $rootScope, age) {

    var mapper = {
      map: map,
      mapPatient: mapPatient
    };
    return mapper;

    ////////////////

    function map(openmrsPatient) {
      const patient = patientModel.create(),
            birthdate = parseDate(openmrsPatient.person.birthdate);

      patient.givenName = openmrsPatient.person.preferredName.givenName;
      patient.middleName = openmrsPatient.person.preferredName.middleName;
      patient.familyName = openmrsPatient.person.preferredName.familyName;
      patient.fullName = openmrsPatient.person.preferredName.givenName
        + (openmrsPatient.person.preferredName.middleName ? " " + openmrsPatient.person.preferredName.middleName + " " : " ")
        + openmrsPatient.person.preferredName.familyName;
      patient.birthdate = !birthdate ? "" : birthdate;
      patient.birthdateEstimated = openmrsPatient.person.birthdateEstimated;
      patient.age = birthdate ? age.fromBirthDate(openmrsPatient.person.birthdate) : null;
      patient.gender = openmrsPatient.person.gender;
      patient.address = mapAddress(openmrsPatient.person.preferredAddress);
      patient.dead = openmrsPatient.dead;
      patient.causeOfDeath = (openmrsPatient.dead === true) ? openmrsPatient.causeOfDeath : null;
      patient.deathDate = (openmrsPatient.dead === true) ? openmrsPatient.deathDate : null;
      //TODO: must get the identifier to display from openmrs configurations
      patient.identifier = openmrsPatient.identifiers[0].identifier;
      patient.identifierType = openmrsPatient.identifiers[0].identifierType.display;
      patient.image = Poc.Patient.Constants.patientImageURL + openmrsPatient.uuid + ".jpeg?q=" + new Date().toISOString();
      patient.registrationDate = parseDate(openmrsPatient.person.auditInfo.dateCreated);
      mapAttributes(patient, openmrsPatient.person.attributes);
      patient.identifiers = openmrsPatient.identifiers;
      patient.uuid = openmrsPatient.uuid;

      return patient;
    }

    function mapPatient(results) {
      var preparedResults = [];
      for (var patientIndex in results) {
        var result = results[patientIndex];
        var patient = map(result);

        preparedResults.push(patient);
      }
      return preparedResults;
    }

    function addAttributeToPatient(patient, attribute) {
      var attributeType = attribute.attributeType;
      if (attributeType) {
        if (attributeType.format === "org.openmrs.Concept" && attribute.value) {
          patient[attributeType.name] = attribute.value.uuid;
        }else if (attributeType.format === "org.openmrs.util.AttributableDate") {
            patient[attributeType.name] = parseDate(attribute.value);
        } else {
          patient[attributeType.name] = attribute.value;
        }
      }
    }

    function mapAttributes(patient, attributes) {
      attributes.forEach(attribute => {
        addAttributeToPatient(patient, attribute);
      });
    }

    function parseDate(dateStr) {
      return dateStr ? new Date(dateStr) : dateStr;
    }

    function mapAddress(preferredAddress) {
      return preferredAddress || {};
    }
  }

})();
