'use strict';

describe("Initialization", function () {
  var scope, rootScope, configNames, configurations, mockAppDescriptor, mockAppService, mandatoryPersonAttributes, patientAttributeTypes;


  var configNames = ['patientAttributesConfig', 'addressLevels'];

  var configurations = jasmine.createSpyObj('configurations',['load']);

  // var patientConfigs = new Poc.Patient.PatientAttributeTypeMapper().mapFromOpenmrsPatientAttributeTypes(configurations.patientAttributesConfig(), mandatoryPersonAttributes);

  mockAppDescriptor = jasmine.createSpyObj('appDescriptor',['getConfigValue']);
  mockAppService = jasmine.createSpyObj('appService', ['getAppDescriptor']);

  beforeEach(module('clinic'));

  describe('Initialization', function() {
    beforeEach(function(){
      mockAppDescriptor.getConfigValue().and.returnValue(mandatoryPersonAttributes);
      mockAppService.getAppDescriptor().and.returnValue(mockAppDescriptor);
    });

    // it('should call the appService obtain the appDescriptor and initialize the var  values', function () {
    //   expect(mockAppDescriptor.getAppDescriptor).toHaveBeenCalled();
    // });

  });

});
