'use strict';

describe('createEncounterMapper', function () {

  var createEncounterMapper, formPayload, formParts, patient, location, provider, jan312018;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_createEncounterMapper_) {
    createEncounterMapper = _createEncounterMapper_;
    jan312018 = new Date(2018, 0, 31);
    formPayload = {
      encounterType: {
        uuid: 'e278f956-1d5f-11e0-b929-000c29ad1d07'
      },
      form: {
        uuid: 'e28aa7aa-1d5f-11e0-b929-000c29ad1d07',
        fields: {
          '0fcf9f12-2f0c-462f-81ad-b9f0bc65bfea': {
            field: {
              concept: {
                datatype: {
                  display: 'Date'
                },
                uuid: '088deb09-4aa4-4533-8b21-5c04f6c3e4a6'
              }
            },
            value: jan312018
          }
        },
        fieldType: {
          display: 'Concept'
        }
      }
    };
    formParts = [
      {
        fields: [
          {id: '0fcf9f12-2f0c-462f-81ad-b9f0bc65bfea'}
        ]
      }
    ];
    patient = 'd5b9d975-9412-4d14-a264-c72e557c9d58';
    provider = 'e2bc25aa-1d5f-11e0-b929-000c29ad1d07';
    location = '7fc3f286-15b1-465e-9013-b72916f58b2d';
  }));

  describe('mapFromFormPayload', function () {

    it('should format date and datetime datatypes', function () {

      var encounter = createEncounterMapper.mapFromFormPayload(formPayload, formParts, patient, location, provider);

      expect(encounter).toEqual({
        encounterType: 'e278f956-1d5f-11e0-b929-000c29ad1d07',
        patient: 'd5b9d975-9412-4d14-a264-c72e557c9d58',
        location: '7fc3f286-15b1-465e-9013-b72916f58b2d',
        form: 'e28aa7aa-1d5f-11e0-b929-000c29ad1d07',
        provider: 'e2bc25aa-1d5f-11e0-b929-000c29ad1d07',
        obs: [
          {
            concept: '088deb09-4aa4-4533-8b21-5c04f6c3e4a6',
            value: jan312018,
            person: 'd5b9d975-9412-4d14-a264-c72e557c9d58'
          }
        ]
      });

    });

  });

});
