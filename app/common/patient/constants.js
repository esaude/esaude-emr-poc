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

(function () {
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
        {name: "Proveniência", uuid: "46e79fce-ba89-4ec9-8f31-2dfd9318d415"},
        {name: "Ponto de Referência", uuid: "ce778a93-66f9-4607-9d80-8794ed127674"},
        {name: "Numero de Telefone 1", uuid: "46e79fce-ba89-4ec9-8f31-2dfd9318d415"},
        {name: "Numero de Telefone 2", uuid: "ce778a93-66f9-4607-9d80-8794ed127674"}
      ],
      name: [
        {name: "Alcunha", uuid: "5719d315-dbe7-4da0-bf90-466f09b5b777"}
      ]
    })
    .constant('mandatoryPersonAttributes', [
      'Proveniência'
    ])
    .constant('patientRepresentation',
      'custom:(uuid,identifiers,person:(auditInfo,birthdate,birthdateEstimated,gender,preferredAddress,preferredName,attributes:(value,attributeType:(name,format))');

})();
