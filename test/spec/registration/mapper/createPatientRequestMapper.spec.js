'use strict';

describe('CreatePatientRequestMapper', function () {

  var patient;
  var patientAttributeTypes;
  var identifiersMock, identifierDetails;
  var date = new Date();

  beforeEach(function () {
    module('registration');
    module('common.patient');
    module(function($provide){
      identifiersMock = jasmine.createSpyObj('identifiers', ['create']);
      identifierDetails = {
        primaryIdentifier: {
          identifierType: {
            primary: true,
            uuid: "identifier-type-uuid",
            identifierSources: [{
              prefix: "GAN",
              uuid: 'dead-cafe'
            }, {
              prefix: "SEM",
              uuid: 'new-cafe'
            }]
          }
        }
      };
      identifiersMock.create.and.returnValue(identifierDetails);

      $provide.value('identifiers', identifiersMock);
    });
    inject(['patient', function (patientFactory) {
      patient = patientFactory.create();
    }]);

    patientAttributeTypes = [
      {
        "uuid": "class-uuid",
        "sortWeight": 2.0,
        "name": "class",
        "description": "Caste",
        "format": "java.lang.String",
        "answers": []
      },
      {
        "uuid": "education-uuid",
        "sortWeight": 2.0,
        "name": "education",
        "description": "Caste",
        "format": "java.lang.String",
        "answers": []
      },
      {
        "uuid": "testDate-uuid",
        "sortWeight": 2.0,
        "name": "testDate",
        "description": "Test Date",
        "format": "org.openmrs.util.AttributableDate",
        "answers": []
      }
    ];

  });

  it('should map angular patient model to openmrs patient', function () {

    angular.extend(patient, {
      "givenName": "gname",
      "familyName": "fname",
      "address": {
        "address1": "house street",
        "address2": "grampan",
        "address3": "tehsil",
        "cityVillage": "vill",
        "countyDistrict": "dist"
      },
      "birthdate": moment(date).format("DD-MM-YYYY"),
      "age": {
        "years": 0,
        "months": 4,
        "days": 17
      },
      "gender": "M",
      "registrationDate": moment(date).format(),
      "education": "16",
      "occupation": "23",
      "primaryContact": "primary cont",
      "secondaryContact": "second cont",
      "healthCenter": "2",
      "primaryRelative": "fathus name",
      "class": "10",
      "givenNameLocal": "fmoz",
      "familyNameLocal": "lmoz",
      "secondaryIdentifier": "sec id",
      "isNew": "true",
      "dead": true,
      "causeOfDeath": 'uuid',
      "deathDate": null,

      "testDate": "Fri Jan 01 1999 00:00:00"
    });

    var openmrsPatient = new Bahmni.Registration.CreatePatientRequestMapper(new Date()).mapFromPatient(patientAttributeTypes, patient);

    expect(openmrsPatient.patient.person.names).toEqual([
      {
        givenName: "gname",
        familyName: "fname",
        middleName: undefined,
        "preferred": false
      }
    ]);

    expect(openmrsPatient.patient.person.addresses).toEqual([
      {
        address1: "house street",
        address2: "grampan",
        address3: "tehsil",
        cityVillage: "vill",
        countyDistrict: "dist"

      }
    ]);

    expect(openmrsPatient.patient.person.gender).toBe("M");

    expect(openmrsPatient.patient.person.dead).toBe(true);

    expect(openmrsPatient.patient.person.deathDate).toBe(null);

    expect(openmrsPatient.patient.person.causeOfDeath).toBeUndefined();

    expect(openmrsPatient.patient.identifiers.length).toBe(0);



    expect(openmrsPatient.patient.person.personDateCreated).toBe(moment(date).format());
  });
    });
