var Poc = Poc || {};
Poc.Patient = Poc.Patient || {};

Poc.Patient.Constants = {
  openmrsUrl: "/openmrs",
  registrationEncounterType: "REG",
  baseOpenMRSRESTURL: "/openmrs/ws/rest/v1",
  patientImageURL: "/patient_images/",
  bahmniRESTBaseURL: "/openmrs/ws/rest/v1/bahmnicore",
  emrApiRESTBaseURL: "/openmrs/ws/rest/emrapi",
  emrApiEncounterUrl: "/openmrs/ws/rest/emrapi/encounter",
  obsRestUrl: "/openmrs/ws/rest/v1/obs",
  webServiceRestBaseURL: "/openmrs/ws/rest/v1"
};

Poc.Patient.Constants.Errors = {};

(() => {
  'use strict';

  angular
    .module('common.patient')
    .constant('additionalPatientAttributes', {
      testing: [
        {name: "Data do teste HIV", uuid: "46e79fce-ba89-4ec9-8f31-2dfd9318d415"},
        {name: "Tipo de teste HIV", uuid: "ce778a93-66f9-4607-9d80-8794ed127674"},
        {name: "Resultado do Teste HIV", uuid: "31cb61f4-3d81-403d-94e9-64cce17a2a00"}
      ],
      other: [
        {name: "Proveniência", uuid: "d10628a7-ba75-4495-840b-bf6f1c44fd2d"},
        {name: "Ponto de Referência", uuid: "e944813c-11b1-49f3-b9a5-9fbbd10beec2"},
        {name: "Numero de Telefone 1", uuid: "e2e3fd64-1d5f-11e0-b929-000c29ad1d07"},
        {name: "Numero de Telefone 2", uuid: "e6c97a9d-a77b-401f-b06e-81900e21ed1d"}
      ],
      name: [
        {name: "Alcunha", uuid: "d82b0cf4-26cc-11e8-bdc0-2b5ea141f82e"}
      ]
    })
    .constant('mandatoryPersonAttributes', [
      'Proveniência',
      'Data do teste HIV',
      'Tipo de teste HIV',
    ])
    .constant('patientRepresentation',
      'custom:(uuid,identifiers:(uuid,display,identifier,preferred,identifierType:(uuid,display,required,formatDescription)),person:(auditInfo,birthdate,birthdateEstimated,gender,preferredAddress,preferredName,attributes:(value,attributeType:(name,format))');

})();
