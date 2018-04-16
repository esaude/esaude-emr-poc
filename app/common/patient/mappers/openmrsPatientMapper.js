(function () {
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
      var patient = patientModel.create(),
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
      patient.dead = openmrsPatient.person.dead,
        patient.causeOfDeath = (openmrsPatient.person.dead === true) ? openmrsPatient.person.causeOfDeath : null,
        patient.deathDate = (openmrsPatient.person.dead === true) ? openmrsPatient.person.deathDate : null,
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
      var attributeType = $rootScope.patientConfiguration.get(attribute.attributeType.uuid);
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

    function whereAttributeTypeExists(attribute) {
      return (!$rootScope.patientConfiguration) ? $rootScope.patientConfiguration : 
          $rootScope.patientConfiguration.get(attribute.attributeType.uuid);
    }

    function mapAttributes(patient, attributes) {
      attributes.filter(whereAttributeTypeExists).forEach(function (attribute) {
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
