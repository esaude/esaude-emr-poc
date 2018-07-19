describe('openmrsPatientMapper', () => {

  const baseTime = new Date();

  let openMRSPatientMapper;

  beforeEach(module('common.patient'));

  beforeEach(inject((_openmrsPatientMapper_) => {
    openMRSPatientMapper = _openmrsPatientMapper_;
  }));

  describe('map', ()=> {

    it('should map', () => {

      jasmine.clock().mockDate(baseTime);

      const mappedPatient = openMRSPatientMapper.map(openMRSPatient);
      expect(mappedPatient.address).toEqual(pocPatient.address);
      expect(mappedPatient.years).toEqual(pocPatient.years);
      expect(mappedPatient.months).toEqual(pocPatient.months);
      expect(mappedPatient.days).toEqual(pocPatient.days);
      expect(mappedPatient.birthdate).toEqual(pocPatient.birthdate);
      expect(mappedPatient.birthdateEstimated).toEqual(pocPatient.birthdateEstimated);
      expect(mappedPatient.causeOfDeath).toEqual(pocPatient.causeOfDeath);
      expect(mappedPatient.dead).toEqual(pocPatient.dead);
      expect(mappedPatient.deathDate).toEqual(pocPatient.deathDate);
      expect(mappedPatient.familyName).toEqual(pocPatient.familyName);
      expect(mappedPatient.fullName).toEqual(pocPatient.fullName);
      expect(mappedPatient.gender).toEqual(pocPatient.gender);
      expect(mappedPatient.givenName).toEqual(pocPatient.givenName);
      expect(mappedPatient.identifier).toEqual(pocPatient.identifier);
      expect(mappedPatient.identifiers).toEqual(pocPatient.identifiers);
      expect(mappedPatient.identifierType).toEqual(pocPatient.identifierType);
      expect(mappedPatient.image).toEqual(pocPatient.image);
      expect(mappedPatient.middleName).toEqual(pocPatient.middleName);
      expect(mappedPatient.registrationDate).toEqual(pocPatient.registrationDate);
      expect(mappedPatient.uuid).toEqual(pocPatient.uuid);
    });

  });

  const openMRSPatient = {
    "uuid": "3c51310c-5384-4c2a-b3eb-754c1c275870",
    "display": "12345678/12/12345 - Malocy Ladon",
    "identifiers": [
      {
        "display": "NID (SERVICO TARV) = 12345678/12/12345",
        "uuid": "428f39c8-5d4d-47c4-9586-dba406cf9e42",
        "identifier": "12345678/12/12345",
        "identifierType": {
          "uuid": "e2b966d0-1d5f-11e0-b929-000c29ad1d07",
          "display": "NID (SERVICO TARV)",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patientidentifiertype/e2b966d0-1d5f-11e0-b929-000c29ad1d07"
            }
          ]
        },
        "location": {
          "uuid": "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
          "display": "Local Desconhecido",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/location/8d6c993e-c2cc-11de-8d13-0010c6dffd0f"
            }
          ]
        },
        "preferred": true,
        "voided": false,
        "links": [
          {
            "rel": "self",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870/identifier/428f39c8-5d4d-47c4-9586-dba406cf9e42"
          },
          {
            "rel": "full",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870/identifier/428f39c8-5d4d-47c4-9586-dba406cf9e42?v=full"
          }
        ],
        "resourceVersion": "1.8"
      },
      {
        "display": "BILHETE DE IDENTIDADE (BI) = 123654852X",
        "uuid": "8faebc45-79b4-4104-acd0-cef8e530ff9e",
        "identifier": "123654852X",
        "identifierType": {
          "uuid": "e2b9682e-1d5f-11e0-b929-000c29ad1d07",
          "display": "BILHETE DE IDENTIDADE (BI)",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patientidentifiertype/e2b9682e-1d5f-11e0-b929-000c29ad1d07"
            }
          ]
        },
        "location": {
          "uuid": "ca30a1d0-1dd5-406c-b8e0-590c5238d985",
          "display": "CS  Macomia",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/location/ca30a1d0-1dd5-406c-b8e0-590c5238d985"
            }
          ]
        },
        "preferred": false,
        "voided": false,
        "links": [
          {
            "rel": "self",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870/identifier/8faebc45-79b4-4104-acd0-cef8e530ff9e"
          },
          {
            "rel": "full",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870/identifier/8faebc45-79b4-4104-acd0-cef8e530ff9e?v=full"
          }
        ],
        "resourceVersion": "1.8"
      }
    ],
    "person": {
      "uuid": "3c51310c-5384-4c2a-b3eb-754c1c275870",
      "display": "Malocy Ladon",
      "gender": "F",
      "age": 35,
      "birthdate": "1983-05-12T00:00:00.000+0200",
      "birthdateEstimated": false,
      "dead": false,
      "deathDate": null,
      "causeOfDeath": null,
      "preferredName": {
        "display": "Malocy Ladon",
        "uuid": "8f86d7a8-cc1e-4340-bdc6-4967ae557739",
        "givenName": "Malocy",
        "middleName": null,
        "familyName": "Ladon",
        "familyName2": null,
        "voided": false,
        "links": [
          {
            "rel": "self",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/name/8f86d7a8-cc1e-4340-bdc6-4967ae557739"
          },
          {
            "rel": "full",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/name/8f86d7a8-cc1e-4340-bdc6-4967ae557739?v=full"
          }
        ],
        "resourceVersion": "1.8"
      },
      "preferredAddress": {
        "display": null,
        "uuid": "85f3de59-5f5d-4296-8d88-5819f87d952b",
        "preferred": true,
        "address1": null,
        "address2": "Maganja da Costa",
        "cityVillage": null,
        "stateProvince": "Zambezia",
        "country": "Mocambique",
        "postalCode": null,
        "countyDistrict": "Maganja da Costa",
        "address3": null,
        "address4": null,
        "address5": null,
        "address6": null,
        "startDate": null,
        "endDate": null,
        "latitude": null,
        "longitude": null,
        "voided": false,
        "links": [
          {
            "rel": "self",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/address/85f3de59-5f5d-4296-8d88-5819f87d952b"
          },
          {
            "rel": "full",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/address/85f3de59-5f5d-4296-8d88-5819f87d952b?v=full"
          }
        ],
        "resourceVersion": "1.8"
      },
      "names": [
        {
          "display": "Malocy Ladon",
          "uuid": "8f86d7a8-cc1e-4340-bdc6-4967ae557739",
          "givenName": "Malocy",
          "middleName": null,
          "familyName": "Ladon",
          "familyName2": null,
          "voided": false,
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/name/8f86d7a8-cc1e-4340-bdc6-4967ae557739"
            },
            {
              "rel": "full",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/name/8f86d7a8-cc1e-4340-bdc6-4967ae557739?v=full"
            }
          ],
          "resourceVersion": "1.8"
        }
      ],
      "addresses": [
        {
          "display": null,
          "uuid": "85f3de59-5f5d-4296-8d88-5819f87d952b",
          "preferred": true,
          "address1": null,
          "address2": "Maganja da Costa",
          "cityVillage": null,
          "stateProvince": "Zambezia",
          "country": "Mocambique",
          "postalCode": null,
          "countyDistrict": "Maganja da Costa",
          "address3": null,
          "address4": null,
          "address5": null,
          "address6": null,
          "startDate": null,
          "endDate": null,
          "latitude": null,
          "longitude": null,
          "voided": false,
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/address/85f3de59-5f5d-4296-8d88-5819f87d952b"
            },
            {
              "rel": "full",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/address/85f3de59-5f5d-4296-8d88-5819f87d952b?v=full"
            }
          ],
          "resourceVersion": "1.8"
        }
      ],
      "attributes": [
        {
          "display": "PREVENCAO DE TRANSMISSAO VERTICAL",
          "uuid": "d11b19f0-fa13-409f-a7aa-6dba5c3ea0da",
          "value": {
            "uuid": "e1dca6e6-1d5f-11e0-b929-000c29ad1d07",
            "display": "PREVENCAO DE TRANSMISSAO VERTICAL",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/concept/e1dca6e6-1d5f-11e0-b929-000c29ad1d07"
              }
            ]
          },
          "attributeType": {
            "uuid": "d10628a7-ba75-4495-840b-bf6f1c44fd2d",
            "display": "Proveniência",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/personattributetype/d10628a7-ba75-4495-840b-bf6f1c44fd2d"
              }
            ]
          },
          "voided": false,
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/d11b19f0-fa13-409f-a7aa-6dba5c3ea0da"
            },
            {
              "rel": "full",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/d11b19f0-fa13-409f-a7aa-6dba5c3ea0da?v=full"
            }
          ],
          "resourceVersion": "1.8"
        },
        {
          "display": "Ponto de Referência = Esquina",
          "uuid": "27a571ea-5831-42ba-b44e-9943ef5c6d68",
          "value": "Esquina",
          "attributeType": {
            "uuid": "e944813c-11b1-49f3-b9a5-9fbbd10beec2",
            "display": "Ponto de Referência",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/personattributetype/e944813c-11b1-49f3-b9a5-9fbbd10beec2"
              }
            ]
          },
          "voided": false,
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/27a571ea-5831-42ba-b44e-9943ef5c6d68"
            },
            {
              "rel": "full",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/27a571ea-5831-42ba-b44e-9943ef5c6d68?v=full"
            }
          ],
          "resourceVersion": "1.8"
        },
        {
          "display": "Alcunha = Alcunha",
          "uuid": "77f8228b-103b-4e9a-b7fc-7d4df74c5f0c",
          "value": "Alcunha",
          "attributeType": {
            "uuid": "d82b0cf4-26cc-11e8-bdc0-2b5ea141f82e",
            "display": "Alcunha",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/personattributetype/d82b0cf4-26cc-11e8-bdc0-2b5ea141f82e"
              }
            ]
          },
          "voided": false,
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/77f8228b-103b-4e9a-b7fc-7d4df74c5f0c"
            },
            {
              "rel": "full",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/77f8228b-103b-4e9a-b7fc-7d4df74c5f0c?v=full"
            }
          ],
          "resourceVersion": "1.8"
        },
        {
          "display": "Data do teste HIV = 2018-05-08 00:00",
          "uuid": "f458844e-f7aa-4cb1-ae6c-03babc2798c1",
          "value": "2018-05-08T00:00:00.000+0200",
          "attributeType": {
            "uuid": "46e79fce-ba89-4ec9-8f31-2dfd9318d415",
            "display": "Data do teste HIV",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/personattributetype/46e79fce-ba89-4ec9-8f31-2dfd9318d415"
              }
            ]
          },
          "voided": false,
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/f458844e-f7aa-4cb1-ae6c-03babc2798c1"
            },
            {
              "rel": "full",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/f458844e-f7aa-4cb1-ae6c-03babc2798c1?v=full"
            }
          ],
          "resourceVersion": "1.8"
        },
        {
          "display": "PCR EXAME/TESTE",
          "uuid": "2fd726ae-9ca5-4c05-bd55-fd2f68d2719f",
          "value": {
            "uuid": "e1d7f61e-1d5f-11e0-b929-000c29ad1d07",
            "display": "PCR EXAME/TESTE",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/concept/e1d7f61e-1d5f-11e0-b929-000c29ad1d07"
              }
            ]
          },
          "attributeType": {
            "uuid": "ce778a93-66f9-4607-9d80-8794ed127674",
            "display": "Tipo de teste HIV",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/personattributetype/ce778a93-66f9-4607-9d80-8794ed127674"
              }
            ]
          },
          "voided": false,
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/2fd726ae-9ca5-4c05-bd55-fd2f68d2719f"
            },
            {
              "rel": "full",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/2fd726ae-9ca5-4c05-bd55-fd2f68d2719f?v=full"
            }
          ],
          "resourceVersion": "1.8"
        },
        {
          "display": "MA QUALIDADE DA AMOSTRA",
          "uuid": "3b00d514-1dcb-485c-adfe-74e21956bdda",
          "value": {
            "uuid": "e1da2600-1d5f-11e0-b929-000c29ad1d07",
            "display": "MA QUALIDADE DA AMOSTRA",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/concept/e1da2600-1d5f-11e0-b929-000c29ad1d07"
              }
            ]
          },
          "attributeType": {
            "uuid": "31cb61f4-3d81-403d-94e9-64cce17a2a00",
            "display": "Resultado do Teste HIV",
            "links": [
              {
                "rel": "self",
                "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/personattributetype/31cb61f4-3d81-403d-94e9-64cce17a2a00"
              }
            ]
          },
          "voided": false,
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/3b00d514-1dcb-485c-adfe-74e21956bdda"
            },
            {
              "rel": "full",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/attribute/3b00d514-1dcb-485c-adfe-74e21956bdda?v=full"
            }
          ],
          "resourceVersion": "1.8"
        }
      ],
      "voided": false,
      "auditInfo": {
        "creator": {
          "uuid": "85a05c5e-1e3d-11e0-acca-000c29d83bf2",
          "display": "admin",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/user/85a05c5e-1e3d-11e0-acca-000c29d83bf2"
            }
          ]
        },
        "dateCreated": "2018-05-12T16:39:59.000+0200",
        "changedBy": {
          "uuid": "85a05c5e-1e3d-11e0-acca-000c29d83bf2",
          "display": "admin",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/user/85a05c5e-1e3d-11e0-acca-000c29d83bf2"
            }
          ]
        },
        "dateChanged": "2018-05-21T15:32:07.000+0200"
      },
      "deathdateEstimated": false,
      "birthtime": null,
      "links": [
        {
          "rel": "self",
          "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870"
        }
      ],
      "resourceVersion": "1.11"
    },
    "voided": false,
    "auditInfo": {
      "creator": {
        "uuid": "85a05c5e-1e3d-11e0-acca-000c29d83bf2",
        "display": "admin",
        "links": [
          {
            "rel": "self",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/user/85a05c5e-1e3d-11e0-acca-000c29d83bf2"
          }
        ]
      },
      "dateCreated": "2018-05-12T16:39:59.000+0200",
      "changedBy": {
        "uuid": "85a05c5e-1e3d-11e0-acca-000c29d83bf2",
        "display": "admin",
        "links": [
          {
            "rel": "self",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/user/85a05c5e-1e3d-11e0-acca-000c29d83bf2"
          }
        ]
      },
      "dateChanged": "2018-05-21T15:32:07.000+0200"
    },
    "links": [
      {
        "rel": "self",
        "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870"
      }
    ],
    "resourceVersion": "1.8"
  };

  const pocPatient = {
    "address": {
      "display": null,
      "uuid": "85f3de59-5f5d-4296-8d88-5819f87d952b",
      "preferred": true,
      "address1": null,
      "address2": "Maganja da Costa",
      "cityVillage": null,
      "stateProvince": "Zambezia",
      "country": "Mocambique",
      "postalCode": null,
      "countyDistrict": "Maganja da Costa",
      "address3": null,
      "address4": null,
      "address5": null,
      "address6": null,
      "startDate": null,
      "endDate": null,
      "latitude": null,
      "longitude": null,
      "voided": false,
      "links": [
        {
          "rel": "self",
          "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/address/85f3de59-5f5d-4296-8d88-5819f87d952b"
        },
        {
          "rel": "full",
          "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/person/3c51310c-5384-4c2a-b3eb-754c1c275870/address/85f3de59-5f5d-4296-8d88-5819f87d952b?v=full"
        }
      ],
      "resourceVersion": "1.8"
    },
    "age": {
      "years": 35,
      "months": 2,
      "days": 5
    },
    "birthdate": new Date("1983-05-12T00:00:00.000+0200"),
    "birthdateEstimated": false,
    "image": `/patient_images/3c51310c-5384-4c2a-b3eb-754c1c275870.jpeg?q=${baseTime.toISOString()}`,
    "relationships": [],
    "newlyAddedRelationships": [
      {}
    ],
    "identifiers": [
      {
        "display": "NID (SERVICO TARV) = 12345678/12/12345",
        "uuid": "428f39c8-5d4d-47c4-9586-dba406cf9e42",
        "identifier": "12345678/12/12345",
        "identifierType": {
          "uuid": "e2b966d0-1d5f-11e0-b929-000c29ad1d07",
          "display": "NID (SERVICO TARV)",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patientidentifiertype/e2b966d0-1d5f-11e0-b929-000c29ad1d07"
            }
          ]
        },
        "location": {
          "uuid": "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
          "display": "Local Desconhecido",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/location/8d6c993e-c2cc-11de-8d13-0010c6dffd0f"
            }
          ]
        },
        "preferred": true,
        "voided": false,
        "links": [
          {
            "rel": "self",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870/identifier/428f39c8-5d4d-47c4-9586-dba406cf9e42"
          },
          {
            "rel": "full",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870/identifier/428f39c8-5d4d-47c4-9586-dba406cf9e42?v=full"
          }
        ],
        "resourceVersion": "1.8"
      },
      {
        "display": "BILHETE DE IDENTIDADE (BI) = 123654852X",
        "uuid": "8faebc45-79b4-4104-acd0-cef8e530ff9e",
        "identifier": "123654852X",
        "identifierType": {
          "uuid": "e2b9682e-1d5f-11e0-b929-000c29ad1d07",
          "display": "BILHETE DE IDENTIDADE (BI)",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patientidentifiertype/e2b9682e-1d5f-11e0-b929-000c29ad1d07"
            }
          ]
        },
        "location": {
          "uuid": "ca30a1d0-1dd5-406c-b8e0-590c5238d985",
          "display": "CS  Macomia",
          "links": [
            {
              "rel": "self",
              "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/location/ca30a1d0-1dd5-406c-b8e0-590c5238d985"
            }
          ]
        },
        "preferred": false,
        "voided": false,
        "links": [
          {
            "rel": "self",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870/identifier/8faebc45-79b4-4104-acd0-cef8e530ff9e"
          },
          {
            "rel": "full",
            "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/patient/3c51310c-5384-4c2a-b3eb-754c1c275870/identifier/8faebc45-79b4-4104-acd0-cef8e530ff9e?v=full"
          }
        ],
        "resourceVersion": "1.8"
      }
    ],
    "givenName": "Malocy",
    "middleName": null,
    "familyName": "Ladon",
    "fullName": "Malocy Ladon",
    "gender": "F",
    "causeOfDeath": null,
    "deathDate": null,
    "identifier": "12345678/12/12345",
    "identifierType": "NID (SERVICO TARV)",
    "registrationDate": new Date("2018-05-12T16:39:59.000+0200"),
    "undefined": {
      "uuid": "e1da2600-1d5f-11e0-b929-000c29ad1d07",
      "display": "MA QUALIDADE DA AMOSTRA",
      "links": [
        {
          "rel": "self",
          "uri": "http://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrshttp://0.0.0.0:9000/openmrs/ws/rest/v1/concept/e1da2600-1d5f-11e0-b929-000c29ad1d07"
        }
      ]
    },
    "uuid": "3c51310c-5384-4c2a-b3eb-754c1c275870"
  };


});
