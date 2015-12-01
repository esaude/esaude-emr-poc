'use strict';

angular.module('registration').factory('openmrsPatientMapper', ['patient', '$rootScope', 'age',
    function (patientModel, $rootScope, age) {
        var whereAttributeTypeExists = function (attribute) {
                return $rootScope.patientConfiguration.get(attribute.attributeType.uuid);
            },
            addAttributeToPatient = function (patient, attribute) {
                var attributeType = $rootScope.patientConfiguration.get(attribute.attributeType.uuid);
                if (attributeType) {
                    if (attributeType.format === "org.openmrs.Concept" && attribute.value) {
                        patient[attributeType.name] = attribute.value.uuid;
                    } else {
                        patient[attributeType.name] = attribute.value;
                    }
                }
            },
            mapAttributes = function (patient, attributes) {
                attributes.filter(whereAttributeTypeExists).forEach(function (attribute) {
                    addAttributeToPatient(patient, attribute);

                });
            },
            pad = function (number) {
                return number > 9 ? number.toString() : "0" + number.toString();
            },
            parseDate = function (dateStr) {
                return dateStr ? new Date(dateStr) : dateStr;
            },
            getDateStr = function (date) {
                return date ? pad(date.getDate()) + "-" + pad(date.getMonth() + 1) + "-" + date.getFullYear() : "";
            },
            mapAddress = function (preferredAddress) {
                return preferredAddress || {};
            },
            map = function (openmrsPatient) {
                var patient = patientModel.create(),
                    birthdate = parseDate(openmrsPatient.person.birthdate);
                patient.givenName = openmrsPatient.person.preferredName.givenName;
                patient.middleName = openmrsPatient.person.preferredName.middleName;
                patient.familyName = openmrsPatient.person.preferredName.familyName;
                patient.fullName = openmrsPatient.person.preferredName.givenName
                    + (openmrsPatient.person.preferredName.middleName ? " " + openmrsPatient.person.preferredName.middleName + " " : " ")
                    + openmrsPatient.person.preferredName.familyName;
                patient.birthdate = !birthdate ? "" : getDateStr(birthdate);
                patient.birthdateEstimated = openmrsPatient.person.birthdateEstimated;
                patient.age = birthdate ? age.fromBirthDate(openmrsPatient.person.birthdate) : null;
                patient.gender = openmrsPatient.person.gender;
                patient.address = mapAddress(openmrsPatient.person.preferredAddress);
                //TODO: must get the identifier to display from openmrs configurations
                patient.identifier = openmrsPatient.identifiers[0].identifier;
                patient.identifierType = openmrsPatient.identifiers[0].identifierType.display;
                patient.image = Bahmni.Registration.Constants.patientImageURL + openmrsPatient.uuid + ".jpeg?q=" + new Date().toISOString();
                patient.registrationDate = parseDate(openmrsPatient.person.auditInfo.dateCreated);
                mapAttributes(patient, openmrsPatient.person.attributes);
                patient.identifiers = openmrsPatient.identifiers;
                patient.uuid = openmrsPatient.uuid;
                return patient;
            };

        return {
            map: map
        };
    }]);
