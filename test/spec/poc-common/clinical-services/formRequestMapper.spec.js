'use strict';

describe('formRequestMapper', function () {

  var clinicalServicesFormMapper;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_clinicalServicesFormMapper_) {
    clinicalServicesFormMapper = _clinicalServicesFormMapper_;
  }));

  var givenForm = {
    encounterType: {
      uuid: "e278f956-1d5f-11e0-b929-000c29ad1d07",
      display: "S.TARV: ADULTO SEGUIMENTO",
      name: "S.TARV: ADULTO SEGUIMENTO",
      description: "seguimento visita do paciente adulto"
    },
    description: "Ficha de Seguimento adulto",
    display: "ADULTO: SEGUIMENTO",
    uuid: "e28aa7aa-1d5f-11e0-b929-000c29ad1d07",
    formFields: []
  };

  var heightField = {
    uuid: "e292b558-1d5f-11e0-b929-000c29ad1d07",
    required: false,
    field: {
      uuid: "e27a0c56-1d5f-11e0-b929-000c29ad1d07",
      selectMultiple: false,
      fieldType: {
        display: "Concept"
      },
      concept: {
        answers: [],
        set: false,
        setMembers: [],
        uuid: "e1e2e934-1d5f-11e0-b929-000c29ad1d07",
        datatype: {
          display: "Numeric"
        }
      }
    },
  };

  describe('mapFromOpenMRSForm', function () {

    describe('without encounter', function () {

      it('should map from OpenMRS Form', function () {

        givenForm.formFields = [heightField];

        var mapped = clinicalServicesFormMapper.mapFromOpenMRSForm(givenForm);

        expect(mapped).toEqual({
          encounterType: givenForm.encounterType,
          form: {
            name: givenForm.display,
            description: givenForm.description,
            uuid: givenForm.uuid,
            fields: {
              'e292b558-1d5f-11e0-b929-000c29ad1d07': {
                field: {
                  name: givenForm.formFields[0].name,
                  required: givenForm.formFields[0].required,
                  fieldNumber: givenForm.formFields[0].fieldNumber,
                  fieldPart: givenForm.formFields[0].fieldPart,
                  maxOccurs: givenForm.formFields[0].maxOccurs,
                  minOccurs: givenForm.formFields[0].minOccurs,
                  pageNumber: givenForm.formFields[0].pageNumber,
                  parent: givenForm.formFields[0].parent,
                  uuid: givenForm.formFields[0].field.uuid,
                  concept: givenForm.formFields[0].field.concept,
                  fieldType: givenForm.formFields[0].field.fieldType,
                  selectMultiple: givenForm.formFields[0].field.selectMultiple
                }
              }
            }
          }
        });

      });

    });


    describe('with encounter', function () {

      describe('field with normal concept', function () {

        var encounter = {
          obs: [
            {
              concept: {
                uuid: "e1e2e934-1d5f-11e0-b929-000c29ad1d07"
              },
              value: 181
            }
          ]
        };

        describe('without answers', function () {

          it('should fill form field values with value from encounter observations', function () {

            heightField.field.concept.answers = [];
            givenForm.formFields = [heightField];
            encounter.obs[0].value = 181;
            var mapped = clinicalServicesFormMapper.mapFromOpenMRSForm(givenForm, encounter);

            expect(mapped).toEqual({
              encounterType: givenForm.encounterType,
              form: {
                name: givenForm.display,
                description: givenForm.description,
                uuid: givenForm.uuid,
                fields: {
                  'e292b558-1d5f-11e0-b929-000c29ad1d07': {
                    field: {
                      name: givenForm.formFields[0].name,
                      required: givenForm.formFields[0].required,
                      fieldNumber: givenForm.formFields[0].fieldNumber,
                      fieldPart: givenForm.formFields[0].fieldPart,
                      maxOccurs: givenForm.formFields[0].maxOccurs,
                      minOccurs: givenForm.formFields[0].minOccurs,
                      pageNumber: givenForm.formFields[0].pageNumber,
                      parent: givenForm.formFields[0].parent,
                      uuid: givenForm.formFields[0].field.uuid,
                      concept: givenForm.formFields[0].field.concept,
                      fieldType: givenForm.formFields[0].field.fieldType,
                      selectMultiple: givenForm.formFields[0].field.selectMultiple
                    },
                    value: encounter.obs[0].value
                  }
                }
              },
              encounter: encounter
            });

          });

        });

        describe('with answers', function () {



          it('should fill form field values with value from encounter observations', function () {

            heightField.field.concept.answers = [
              {uuid: "e1e2e934-1d5f-11e0-b929-000c29ad1d07"}
            ];
            givenForm.formFields = [heightField];
            encounter.obs[0].value = {uuid: "e1e2e934-1d5f-11e0-b929-000c29ad1d07"};
            var mapped = clinicalServicesFormMapper.mapFromOpenMRSForm(givenForm, encounter);

            expect(mapped).toEqual({
              encounterType: givenForm.encounterType,
              form: {
                name: givenForm.display,
                description: givenForm.description,
                uuid: givenForm.uuid,
                fields: {
                  'e292b558-1d5f-11e0-b929-000c29ad1d07': {
                    field: {
                      name: givenForm.formFields[0].name,
                      required: givenForm.formFields[0].required,
                      fieldNumber: givenForm.formFields[0].fieldNumber,
                      fieldPart: givenForm.formFields[0].fieldPart,
                      maxOccurs: givenForm.formFields[0].maxOccurs,
                      minOccurs: givenForm.formFields[0].minOccurs,
                      pageNumber: givenForm.formFields[0].pageNumber,
                      parent: givenForm.formFields[0].parent,
                      uuid: givenForm.formFields[0].field.uuid,
                      concept: givenForm.formFields[0].field.concept,
                      fieldType: givenForm.formFields[0].field.fieldType,
                      selectMultiple: givenForm.formFields[0].field.selectMultiple
                    },
                    value: heightField.field.concept.answers[0]
                  }
                }
              },
              encounter: encounter
            });

          });

        });

      });

      describe('field with select multiple concept', function () {

        var selectMultipleField = {
          required: false,
          uuid: "bd03f34d-c438-4052-b83a-b530ee8c7c0a",
          field: {
            uuid: "00b84b88-dc3e-4554-8eec-6072a6a0992c",
            selectMultiple: true,
            fieldType: {
              display: "Concept"
            },
            concept: {
              answers: [
                {
                  uuid: "e1e5232a-1d5f-11e0-b929-000c29ad1d07",
                  display: "CANDIDIASIS, ORAL",
                  name: {
                    display: "CANDIDIASIS, ORAL",
                    uuid: "e2445a98-1d5f-11e0-b929-000c29ad1d07",
                    name: "CANDIDIASIS, ORAL",
                    locale: "en",
                    localePreferred: true,
                    conceptNameType: "FULLY_SPECIFIED"
                  },
                  datatype: {
                    uuid: "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f",
                    display: "Coded"
                  },
                  conceptClass: {
                    uuid: "8d4918b0-c2cc-11de-8d13-0010c6dffd0f",
                    display: "Diagnosis"
                  },
                  set: false,
                  version: null,
                  retired: false,
                  names: [
                    {
                      uuid: "e24c3088-1d5f-11e0-b929-000c29ad1d07",
                      display: "CANDIDIASE ORAL"
                    },
                    {
                      uuid: "e2660c6a-1d5f-11e0-b929-000c29ad1d07",
                      display: "THRUSH"
                    },
                    {
                      uuid: "e2445a98-1d5f-11e0-b929-000c29ad1d07",
                      display: "CANDIDIASIS, ORAL"
                    },
                    {
                      uuid: "e25e5e20-1d5f-11e0-b929-000c29ad1d07",
                      display: "AFTA"
                    }
                  ],
                  descriptions: [
                    {
                      uuid: "e225c7ea-1d5f-11e0-b929-000c29ad1d07",
                      display: "Fungal infection of the mouth.  Also the WHO Stage 3 Condition - Oral Candidiasis (Thrush)."
                    },
                    {
                      uuid: "e22bffe8-1d5f-11e0-b929-000c29ad1d07",
                      display: "Infeccao fungica da boca."
                    }
                  ],
                  mappings: [],
                  answers: [
                    {
                      uuid: "e1d81b62-1d5f-11e0-b929-000c29ad1d07",
                      display: "YES"
                    },
                    {
                      uuid: "e1d81c70-1d5f-11e0-b929-000c29ad1d07",
                      display: "NO"
                    },
                    {
                      uuid: "e1dbff8e-1d5f-11e0-b929-000c29ad1d07",
                      display: "NO INFORMATION"
                    }
                  ],
                  setMembers: []
                }
              ],
              set: true,
              uuid: "e1d9077a-1d5f-11e0-b929-000c29ad1d07",
              datatype: {
                display: "Coded"
              }
            }
          }
        };

        var encounter = {
          obs: [
            {
              uuid: "176a5807-8e76-407c-8b3e-52c53d029758",
              concept: {
                uuid: "e1d9077a-1d5f-11e0-b929-000c29ad1d07",
                name: {
                  display: "WHO STAGE 3 ADULT",
                  uuid: "e2401834-1d5f-11e0-b929-000c29ad1d07",
                  name: "WHO STAGE 3 ADULT",
                  locale: "en",
                  localePreferred: true,
                  conceptNameType: "FULLY_SPECIFIED"
                }
              },
              obsDatetime: "2017-10-09T16:05:45.000+0200",
              value: {
                uuid: "e1e5232a-1d5f-11e0-b929-000c29ad1d07",
                display: "CANDIDIASIS, ORAL",
                name: {
                  display: "CANDIDIASIS, ORAL",
                  uuid: "e2445a98-1d5f-11e0-b929-000c29ad1d07",
                  name: "CANDIDIASIS, ORAL",
                  locale: "en",
                  localePreferred: true,
                  conceptNameType: "FULLY_SPECIFIED"
                },
                datatype: {
                  uuid: "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f",
                  display: "Coded"
                },
                conceptClass: {
                  uuid: "8d4918b0-c2cc-11de-8d13-0010c6dffd0f",
                  display: "Diagnosis"
                },
                set: false,
                version: null,
                retired: false,
                names: [
                  {
                    uuid: "e24c3088-1d5f-11e0-b929-000c29ad1d07",
                    display: "CANDIDIASE ORAL"
                  },
                  {
                    uuid: "e2660c6a-1d5f-11e0-b929-000c29ad1d07",
                    display: "THRUSH"
                  },
                  {
                    uuid: "e2445a98-1d5f-11e0-b929-000c29ad1d07",
                    display: "CANDIDIASIS, ORAL"
                  },
                  {
                    uuid: "e25e5e20-1d5f-11e0-b929-000c29ad1d07",
                    display: "AFTA"
                  }
                ],
                descriptions: [
                  {
                    uuid: "e225c7ea-1d5f-11e0-b929-000c29ad1d07",
                    display: "Fungal infection of the mouth.  Also the WHO Stage 3 Condition - Oral Candidiasis (Thrush)."
                  },
                  {
                    uuid: "e22bffe8-1d5f-11e0-b929-000c29ad1d07",
                    display: "Infeccao fungica da boca."
                  }
                ],
                mappings: [],
                answers: [
                  {
                    uuid: "e1d81b62-1d5f-11e0-b929-000c29ad1d07",
                    display: "YES"
                  },
                  {
                    uuid: "e1d81c70-1d5f-11e0-b929-000c29ad1d07",
                    display: "NO"
                  },
                  {
                    uuid: "e1dbff8e-1d5f-11e0-b929-000c29ad1d07",
                    display: "NO INFORMATION"
                  }
                ],
                setMembers: []
              },
              groupMembers: null
            }

          ]
        };

        describe('with answers', function () {

          it('should fill form field values with value from encounter observations', function () {

            givenForm.formFields = [selectMultipleField];

            var mapped = clinicalServicesFormMapper.mapFromOpenMRSForm(givenForm, encounter);

            var value = {};
            value[encounter.obs[0].value.uuid] = JSON.stringify(selectMultipleField.field.concept.answers[0]);

            expect(mapped).toEqual({
              encounterType: givenForm.encounterType,
              form: {
                name: givenForm.display,
                description: givenForm.description,
                uuid: givenForm.uuid,
                fields: {
                  'bd03f34d-c438-4052-b83a-b530ee8c7c0a': {
                    field: {
                      name: givenForm.formFields[0].name,
                      required: givenForm.formFields[0].required,
                      fieldNumber: givenForm.formFields[0].fieldNumber,
                      fieldPart: givenForm.formFields[0].fieldPart,
                      maxOccurs: givenForm.formFields[0].maxOccurs,
                      minOccurs: givenForm.formFields[0].minOccurs,
                      pageNumber: givenForm.formFields[0].pageNumber,
                      parent: givenForm.formFields[0].parent,
                      uuid: givenForm.formFields[0].field.uuid,
                      concept: givenForm.formFields[0].field.concept,
                      fieldType: givenForm.formFields[0].field.fieldType,
                      selectMultiple: givenForm.formFields[0].field.selectMultiple
                    },
                    value: value
                  }
                }
              },
              encounter: encounter
            });

          });

        });

        describe('without answers', function () {

          it('should fill form field values with value from encounter observations', function () {

            selectMultipleField.field.concept.answers = [];
            givenForm.formFields = [selectMultipleField];

            var mapped = clinicalServicesFormMapper.mapFromOpenMRSForm(givenForm, encounter);

            var value = {};
            value[encounter.obs[0].value.uuid] = encounter.obs[0].value;

            expect(mapped).toEqual({
              encounterType: givenForm.encounterType,
              form: {
                name: givenForm.display,
                description: givenForm.description,
                uuid: givenForm.uuid,
                fields: {
                  'bd03f34d-c438-4052-b83a-b530ee8c7c0a': {
                    field: {
                      name: givenForm.formFields[0].name,
                      required: givenForm.formFields[0].required,
                      fieldNumber: givenForm.formFields[0].fieldNumber,
                      fieldPart: givenForm.formFields[0].fieldPart,
                      maxOccurs: givenForm.formFields[0].maxOccurs,
                      minOccurs: givenForm.formFields[0].minOccurs,
                      pageNumber: givenForm.formFields[0].pageNumber,
                      parent: givenForm.formFields[0].parent,
                      uuid: givenForm.formFields[0].field.uuid,
                      concept: givenForm.formFields[0].field.concept,
                      fieldType: givenForm.formFields[0].field.fieldType,
                      selectMultiple: givenForm.formFields[0].field.selectMultiple
                    },
                    value: value
                  }
                }
              },
              encounter: encounter
            });
          });
        });


      });

      describe('field with coded concept datatype', function () {

        var codedField = {
          uuid: "e29399fa-1d5f-11e0-b929-000c29ad1d07",
          required: false,
          field: {
            uuid: "e27ffd6e-1d5f-11e0-b929-000c29ad1d07",
            required: false,
            selectMultiple: false,
            fieldType: {
              display: "Concept"
            },
            concept: {
              answers: [],
              set: false,
              setMembers: [],
              uuid: "e1e53c02-1d5f-11e0-b929-000c29ad1d07",
              datatype: {
                display: "Coded"
              }
            }
          }
        };

        var encounter = {
          obs: [
            {
              concept: {uuid: "e1e53c02-1d5f-11e0-b929-000c29ad1d07"},
              value: {
                uuid: "e1d9055e-1d5f-11e0-b929-000c29ad1d07"
              }
            }
          ]
        };

        describe('with answers', function () {

          it('should fill form field values with value from encounter observations', function () {

            codedField.field.concept.answers = [
              {uuid: "e1d9055e-1d5f-11e0-b929-000c29ad1d07"},
              {uuid: "e1d9066c-1d5f-11e0-b929-000c29ad1d07"},
              {uuid: "e1d9077a-1d5f-11e0-b929-000c29ad1d07"},
              {uuid: "e1d90888-1d5f-11e0-b929-000c29ad1d07"}
            ];
            givenForm.formFields = [codedField];

            var mapped = clinicalServicesFormMapper.mapFromOpenMRSForm(givenForm, encounter);

            var value = codedField.field.concept.answers[0];

            expect(mapped).toEqual({
              encounterType: givenForm.encounterType,
              form: {
                name: givenForm.display,
                description: givenForm.description,
                uuid: givenForm.uuid,
                fields: {
                  'e29399fa-1d5f-11e0-b929-000c29ad1d07': {
                    field: {
                      name: givenForm.formFields[0].name,
                      required: givenForm.formFields[0].required,
                      fieldNumber: givenForm.formFields[0].fieldNumber,
                      fieldPart: givenForm.formFields[0].fieldPart,
                      maxOccurs: givenForm.formFields[0].maxOccurs,
                      minOccurs: givenForm.formFields[0].minOccurs,
                      pageNumber: givenForm.formFields[0].pageNumber,
                      parent: givenForm.formFields[0].parent,
                      uuid: givenForm.formFields[0].field.uuid,
                      concept: givenForm.formFields[0].field.concept,
                      fieldType: givenForm.formFields[0].field.fieldType,
                      selectMultiple: givenForm.formFields[0].field.selectMultiple
                    },
                    value: value
                  }
                }
              },
              encounter: encounter
            });
          });

        });

        describe('without answers', function () {

          it('should fill form field values with value from encounter observations', function () {

            codedField.field.concept.answers = [
              {uuid: "e1d9055e-1d5f-11e0-b929-000c29ad1d07"},
              {uuid: "e1d9066c-1d5f-11e0-b929-000c29ad1d07"},
              {uuid: "e1d9077a-1d5f-11e0-b929-000c29ad1d07"}
            ];
            givenForm.formFields = [codedField];

            var mapped = clinicalServicesFormMapper.mapFromOpenMRSForm(givenForm, encounter);

            var value = JSON.stringify(encounter.obs[0].value);

            expect(mapped).toEqual({
              encounterType: givenForm.encounterType,
              form: {
                name: givenForm.display,
                description: givenForm.description,
                uuid: givenForm.uuid,
                fields: {
                  'e29399fa-1d5f-11e0-b929-000c29ad1d07': {
                    field: {
                      name: givenForm.formFields[0].name,
                      required: givenForm.formFields[0].required,
                      fieldNumber: givenForm.formFields[0].fieldNumber,
                      fieldPart: givenForm.formFields[0].fieldPart,
                      maxOccurs: givenForm.formFields[0].maxOccurs,
                      minOccurs: givenForm.formFields[0].minOccurs,
                      pageNumber: givenForm.formFields[0].pageNumber,
                      parent: givenForm.formFields[0].parent,
                      uuid: givenForm.formFields[0].field.uuid,
                      concept: givenForm.formFields[0].field.concept,
                      fieldType: givenForm.formFields[0].field.fieldType,
                      selectMultiple: givenForm.formFields[0].field.selectMultiple
                    },
                    value: value
                  }
                }
              },
              encounter: encounter
            });

          });

        });

      });

    });

  });

});
