'use strict';

Bahmni.Registration.UpdatePatientRequestMapper = (function () {
    var UpdatePatientRequestMapper = function (currentDate) {
        this.currentDate = currentDate;
    };

    UpdatePatientRequestMapper.prototype.currentDate = undefined;
    
    UpdatePatientRequestMapper.prototype.mapFromPatient = function (patientAttributeTypes, openMRSPatient, patient) {
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
                    birthdate: this.getBirthdate(dateUtil.getDateStr(patient.birthdate), patient.age),
                    birthdateEstimated: patient.birthdate === undefined || patient.birthdate === "",
                    gender: patient.gender,
                    attributes: this.getMrsAttributes(openMRSPatient, patient, patientAttributeTypes),
                    dead: patient.dead,
                    causeOfDeath: (patient.dead === true) ? patient.causeOfDeath.uuid : null,
                    deathDate: (patient.dead === true) ? patient.deathDate : null
                }
            }
        };

        openMRSPatientProfile.patient.identifiers = _.map(patient.identifiers, function (identifier) {
            return {
                uuid: identifier.uuid,
                identifier: identifier.identifier,
                identifierType: identifier.identifierType.uuid,
                preferred: identifier.preferred,
                voided: identifier.voided
            };
        });

        openMRSPatientProfile.relationships = patient.relationships;
        return  openMRSPatientProfile;
    };

    UpdatePatientRequestMapper.prototype.getMrsAttributes = function (openMRSPatient, patient, patientAttributeTypes) {
        var attributes = [];
        patientAttributeTypes.forEach(function (attributeType) {
            var attr = {
                attributeType: {
                    uuid: attributeType.uuid
                }
            };
            var savedAttribute = openMRSPatient.person.attributes.filter(function (attribute) {
                return attributeType.uuid === attribute.attributeType.uuid;
            })[0];

            if (savedAttribute) {
                attr.uuid = savedAttribute.uuid;
                setAttributeValue(attributeType, attr, patient[savedAttribute.attributeType.display]);
            } else {
                setAttributeValue(attributeType, attr, patient[attributeType.name]);
            }
            attributes.push(attr);
        });
        return attributes;
    };    

    var setAttributeValue = function (attributeType, attr, value) {
        if (attributeType.format === "org.openmrs.Concept") {
            attr.hydratedObject = value;
        } else if(value === "" || value === null || value === undefined) {
            attr.voided = true;
        } else {
            attr.value = value.toString();
        }
    };

    UpdatePatientRequestMapper.prototype.getBirthdate = function (birthdate, age) {
        var mnt;
        if (birthdate !== undefined && birthdate !== "") {
            mnt = moment(birthdate, 'DD-MM-YYYY');
        } else if (age !== undefined) {
            mnt = moment(this.currentDate).subtract('days', age.days).subtract('months', age.months).subtract('years', age.years);
        }
        return mnt.format('YYYY-MM-DD');
    };

    return UpdatePatientRequestMapper;
})();
