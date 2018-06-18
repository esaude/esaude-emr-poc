'use strict';

describe('formRequestMapper', () => {

  var clinicalServicesFormMapper;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(_clinicalServicesFormMapper_ => {
    clinicalServicesFormMapper = _clinicalServicesFormMapper_;
  }));

  var clinicalService = {
    form: {
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
    },
    formLayout: {
      parts: []
    }
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

  describe('map', () => {

    describe('without encounter', () => {

      it('should map from OpenMRS Form', () => {

        clinicalService.form.formFields = [heightField];

        var mapped = clinicalServicesFormMapper.map(clinicalService);

        expect(mapped).toEqual({
          encounterType: clinicalService.form.encounterType,
          form: {
            name: clinicalService.form.display,
            description: clinicalService.form.description,
            uuid: clinicalService.form.uuid,
            fields: {
              'e292b558-1d5f-11e0-b929-000c29ad1d07': {
                field: {
                  name: clinicalService.form.formFields[0].name,
                  required: clinicalService.form.formFields[0].required,
                  fieldNumber: clinicalService.form.formFields[0].fieldNumber,
                  fieldPart: clinicalService.form.formFields[0].fieldPart,
                  maxOccurs: clinicalService.form.formFields[0].maxOccurs,
                  minOccurs: clinicalService.form.formFields[0].minOccurs,
                  pageNumber: clinicalService.form.formFields[0].pageNumber,
                  parent: clinicalService.form.formFields[0].parent,
                  uuid: clinicalService.form.formFields[0].field.uuid,
                  concept: clinicalService.form.formFields[0].field.concept,
                  fieldType: clinicalService.form.formFields[0].field.fieldType,
                  selectMultiple: clinicalService.form.formFields[0].field.selectMultiple
                }
              }
            }
          }
        });

      });

    });


    describe('with encounter', () => {

      describe('field with normal concept', () => {

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

        describe('without answers', () => {

          it('should fill form field values with value from encounter observations', () => {

            heightField.field.concept.answers = [];
            clinicalService.form.formFields = [heightField];
            encounter.obs[0].value = 181;
            var mapped = clinicalServicesFormMapper.map(clinicalService, encounter);

            expect(mapped).toEqual({
              encounterType: clinicalService.form.encounterType,
              form: {
                name: clinicalService.form.display,
                description: clinicalService.form.description,
                uuid: clinicalService.form.uuid,
                fields: {
                  'e292b558-1d5f-11e0-b929-000c29ad1d07': {
                    field: {
                      name: clinicalService.form.formFields[0].name,
                      required: clinicalService.form.formFields[0].required,
                      fieldNumber: clinicalService.form.formFields[0].fieldNumber,
                      fieldPart: clinicalService.form.formFields[0].fieldPart,
                      maxOccurs: clinicalService.form.formFields[0].maxOccurs,
                      minOccurs: clinicalService.form.formFields[0].minOccurs,
                      pageNumber: clinicalService.form.formFields[0].pageNumber,
                      parent: clinicalService.form.formFields[0].parent,
                      uuid: clinicalService.form.formFields[0].field.uuid,
                      concept: clinicalService.form.formFields[0].field.concept,
                      fieldType: clinicalService.form.formFields[0].field.fieldType,
                      selectMultiple: clinicalService.form.formFields[0].field.selectMultiple
                    },
                    value: encounter.obs[0].value
                  }
                }
              },
              encounter: encounter
            });

          });

        });

        describe('with answers', () => {



          it('should fill form field values with value from encounter observations', () => {

            heightField.field.concept.answers = [
              {uuid: "e1e2e934-1d5f-11e0-b929-000c29ad1d07"}
            ];
            clinicalService.form.formFields = [heightField];
            encounter.obs[0].value = {uuid: "e1e2e934-1d5f-11e0-b929-000c29ad1d07"};
            var mapped = clinicalServicesFormMapper.map(clinicalService, encounter);

            expect(mapped).toEqual({
              encounterType: clinicalService.form.encounterType,
              form: {
                name: clinicalService.form.display,
                description: clinicalService.form.description,
                uuid: clinicalService.form.uuid,
                fields: {
                  'e292b558-1d5f-11e0-b929-000c29ad1d07': {
                    field: {
                      name: clinicalService.form.formFields[0].name,
                      required: clinicalService.form.formFields[0].required,
                      fieldNumber: clinicalService.form.formFields[0].fieldNumber,
                      fieldPart: clinicalService.form.formFields[0].fieldPart,
                      maxOccurs: clinicalService.form.formFields[0].maxOccurs,
                      minOccurs: clinicalService.form.formFields[0].minOccurs,
                      pageNumber: clinicalService.form.formFields[0].pageNumber,
                      parent: clinicalService.form.formFields[0].parent,
                      uuid: clinicalService.form.formFields[0].field.uuid,
                      concept: clinicalService.form.formFields[0].field.concept,
                      fieldType: clinicalService.form.formFields[0].field.fieldType,
                      selectMultiple: clinicalService.form.formFields[0].field.selectMultiple
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

      describe('field with select multiple concept', () => {

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

        describe('with answers', () => {

          it('should fill form field values with value from encounter observations', () => {

            clinicalService.form.formFields = [selectMultipleField];

            var mapped = clinicalServicesFormMapper.map(clinicalService, encounter);

            var value = {};
            value[encounter.obs[0].value.uuid] = JSON.stringify(selectMultipleField.field.concept.answers[0]);

            expect(mapped).toEqual({
              encounterType: clinicalService.form.encounterType,
              form: {
                name: clinicalService.form.display,
                description: clinicalService.form.description,
                uuid: clinicalService.form.uuid,
                fields: {
                  'bd03f34d-c438-4052-b83a-b530ee8c7c0a': {
                    field: {
                      name: clinicalService.form.formFields[0].name,
                      required: clinicalService.form.formFields[0].required,
                      fieldNumber: clinicalService.form.formFields[0].fieldNumber,
                      fieldPart: clinicalService.form.formFields[0].fieldPart,
                      maxOccurs: clinicalService.form.formFields[0].maxOccurs,
                      minOccurs: clinicalService.form.formFields[0].minOccurs,
                      pageNumber: clinicalService.form.formFields[0].pageNumber,
                      parent: clinicalService.form.formFields[0].parent,
                      uuid: clinicalService.form.formFields[0].field.uuid,
                      concept: clinicalService.form.formFields[0].field.concept,
                      fieldType: clinicalService.form.formFields[0].field.fieldType,
                      selectMultiple: clinicalService.form.formFields[0].field.selectMultiple
                    },
                    value: value
                  }
                }
              },
              encounter: encounter
            });

          });

        });

        describe('without answers', () => {

          it('should fill form field values with value from encounter observations', () => {

            selectMultipleField.field.concept.answers = [];
            clinicalService.form.formFields = [selectMultipleField];

            var mapped = clinicalServicesFormMapper.map(clinicalService, encounter);

            var value = {};
            value[encounter.obs[0].value.uuid] = encounter.obs[0].value;

            expect(mapped).toEqual({
              encounterType: clinicalService.form.encounterType,
              form: {
                name: clinicalService.form.display,
                description: clinicalService.form.description,
                uuid: clinicalService.form.uuid,
                fields: {
                  'bd03f34d-c438-4052-b83a-b530ee8c7c0a': {
                    field: {
                      name: clinicalService.form.formFields[0].name,
                      required: clinicalService.form.formFields[0].required,
                      fieldNumber: clinicalService.form.formFields[0].fieldNumber,
                      fieldPart: clinicalService.form.formFields[0].fieldPart,
                      maxOccurs: clinicalService.form.formFields[0].maxOccurs,
                      minOccurs: clinicalService.form.formFields[0].minOccurs,
                      pageNumber: clinicalService.form.formFields[0].pageNumber,
                      parent: clinicalService.form.formFields[0].parent,
                      uuid: clinicalService.form.formFields[0].field.uuid,
                      concept: clinicalService.form.formFields[0].field.concept,
                      fieldType: clinicalService.form.formFields[0].field.fieldType,
                      selectMultiple: clinicalService.form.formFields[0].field.selectMultiple
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

      describe('field with coded concept datatype', () => {

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

        describe('with answers', () => {

          it('should fill form field values with value from encounter observations', () => {

            codedField.field.concept.answers = [
              {uuid: "e1d9055e-1d5f-11e0-b929-000c29ad1d07"},
              {uuid: "e1d9066c-1d5f-11e0-b929-000c29ad1d07"},
              {uuid: "e1d9077a-1d5f-11e0-b929-000c29ad1d07"},
              {uuid: "e1d90888-1d5f-11e0-b929-000c29ad1d07"}
            ];
            clinicalService.form.formFields = [codedField];

            var mapped = clinicalServicesFormMapper.map(clinicalService, encounter);

            var value = codedField.field.concept.answers[0];

            expect(mapped).toEqual({
              encounterType: clinicalService.form.encounterType,
              form: {
                name: clinicalService.form.display,
                description: clinicalService.form.description,
                uuid: clinicalService.form.uuid,
                fields: {
                  'e29399fa-1d5f-11e0-b929-000c29ad1d07': {
                    field: {
                      name: clinicalService.form.formFields[0].name,
                      required: clinicalService.form.formFields[0].required,
                      fieldNumber: clinicalService.form.formFields[0].fieldNumber,
                      fieldPart: clinicalService.form.formFields[0].fieldPart,
                      maxOccurs: clinicalService.form.formFields[0].maxOccurs,
                      minOccurs: clinicalService.form.formFields[0].minOccurs,
                      pageNumber: clinicalService.form.formFields[0].pageNumber,
                      parent: clinicalService.form.formFields[0].parent,
                      uuid: clinicalService.form.formFields[0].field.uuid,
                      concept: clinicalService.form.formFields[0].field.concept,
                      fieldType: clinicalService.form.formFields[0].field.fieldType,
                      selectMultiple: clinicalService.form.formFields[0].field.selectMultiple
                    },
                    value: value
                  }
                }
              },
              encounter: encounter
            });
          });

        });

        describe('without answers', () => {

          beforeEach(() => {
            clinicalService.formLayout.parts = [];
          });

          describe('searchBySource', () => {

            it('should fill form field values with value from encounter observations', () => {

              clinicalService.formLayout.parts = [
                {
                  fields: {
                    id: 'e29399fa-1d5f-11e0-b929-000c29ad1d07',
                    searchBySource: '3f65bd34-26fe-102b-80cb-0017a47871b2'
                  }
                }
              ];
              clinicalService.form.formFields = [codedField];

              var mapped = clinicalServicesFormMapper.map(clinicalService, encounter);

              var value = encounter.obs[0].value;

              expect(mapped).toEqual({
                encounterType: clinicalService.form.encounterType,
                form: {
                  name: clinicalService.form.display,
                  description: clinicalService.form.description,
                  uuid: clinicalService.form.uuid,
                  fields: {
                    'e29399fa-1d5f-11e0-b929-000c29ad1d07': {
                      field: {
                        name: clinicalService.form.formFields[0].name,
                        required: clinicalService.form.formFields[0].required,
                        fieldNumber: clinicalService.form.formFields[0].fieldNumber,
                        fieldPart: clinicalService.form.formFields[0].fieldPart,
                        maxOccurs: clinicalService.form.formFields[0].maxOccurs,
                        minOccurs: clinicalService.form.formFields[0].minOccurs,
                        pageNumber: clinicalService.form.formFields[0].pageNumber,
                        parent: clinicalService.form.formFields[0].parent,
                        uuid: clinicalService.form.formFields[0].field.uuid,
                        concept: clinicalService.form.formFields[0].field.concept,
                        fieldType: clinicalService.form.formFields[0].field.fieldType,
                        selectMultiple: clinicalService.form.formFields[0].field.selectMultiple
                      },
                      value: value
                    }
                  }
                },
                encounter: encounter
              });
            });

          });

          describe('not searchBySource', () => {

            it('should fill form field values with value from encounter observations', () => {

              codedField.field.concept.answers = [
                {uuid: "e1d9055e-1d5f-11e0-b929-000c29ad1d07"},
                {uuid: "e1d9066c-1d5f-11e0-b929-000c29ad1d07"},
                {uuid: "e1d9077a-1d5f-11e0-b929-000c29ad1d07"}
              ];
              clinicalService.form.formFields = [codedField];

              var mapped = clinicalServicesFormMapper.map(clinicalService, encounter);

              var value = JSON.stringify(encounter.obs[0].value);

              expect(mapped).toEqual({
                encounterType: clinicalService.form.encounterType,
                form: {
                  name: clinicalService.form.display,
                  description: clinicalService.form.description,
                  uuid: clinicalService.form.uuid,
                  fields: {
                    'e29399fa-1d5f-11e0-b929-000c29ad1d07': {
                      field: {
                        name: clinicalService.form.formFields[0].name,
                        required: clinicalService.form.formFields[0].required,
                        fieldNumber: clinicalService.form.formFields[0].fieldNumber,
                        fieldPart: clinicalService.form.formFields[0].fieldPart,
                        maxOccurs: clinicalService.form.formFields[0].maxOccurs,
                        minOccurs: clinicalService.form.formFields[0].minOccurs,
                        pageNumber: clinicalService.form.formFields[0].pageNumber,
                        parent: clinicalService.form.formFields[0].parent,
                        uuid: clinicalService.form.formFields[0].field.uuid,
                        concept: clinicalService.form.formFields[0].field.concept,
                        fieldType: clinicalService.form.formFields[0].field.fieldType,
                        selectMultiple: clinicalService.form.formFields[0].field.selectMultiple
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

});
