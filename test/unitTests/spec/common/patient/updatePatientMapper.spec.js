describe('updatePatientMapper', () => {

  var updatePatientMapper;

  beforeEach(module('common.patient'));

  beforeEach(inject(_updatePatientMapper_ => {
    updatePatientMapper = _updatePatientMapper_;
  }));

  describe('map', () => {


    describe('changed identifiers', () => {

      it('should map changed identifiers string', () => {

        var patientAttributeTypes2 = [];
        var openMRSPatient = {
          birthdate: new Date(),
          person: {names: ['foo']},
          identifiers: [{identifierType: {uuid: 1}, identifier: 'XYZ', preferred: false}]
        };
        var patient = {
          birthdate: new Date(),
          person: {names: ['foo']},
          identifiers: [{identifierType: {uuid: 1}, identifier: 'ZYX', preferred: false}]
        };
        var currentDate = new Date();

        var mapped = updatePatientMapper.map(patientAttributeTypes2, openMRSPatient, patient, currentDate);

        expect(mapped.changedIdentifiers).toContain(jasmine.objectContaining({identifier: 'ZYX'}));
      });

      it('should map changed preferred identifier', () => {

        var patientAttributeTypes2 = [];
        var openMRSPatient = {
          birthdate: new Date(),
          person: {names: ['foo']},
          identifiers: [{identifierType: {uuid: 1}, identifier: 'XYZ', preferred: false}]
        };
        var patient = {
          birthdate: new Date(),
          person: {names: ['foo']},
          identifiers: [{identifierType: {uuid: 1}, identifier: 'XYZ', preferred: true}]
        };
        var currentDate = new Date();

        var mapped = updatePatientMapper.map(patientAttributeTypes2, openMRSPatient, patient, currentDate);

        expect(mapped.changedIdentifiers).toContain(jasmine.objectContaining({identifier: 'XYZ'}));
      });

    });

  });

});
