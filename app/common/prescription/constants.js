(() => {
  'use strict';

  angular
    .module('poc.common.prescription')
    .constant('prescriptionConvSetConceptUUID', 'ac465c58-68ef-4a19-88ae-c7f72e89a2b2')
    .constant('drugPrescriptionConvSet', {
      therapeuticLine: {uuid: "fdff0637-b36f-4dce-90c7-fe9f1ec586f0"},
      prophilaxyPlan: {uuid: "718f4e32-70b8-4d37-b154-4b4fd05106a7"},
      artPlan: {uuid: "e1d9ee10-1d5f-11e0-b929-000c29ad1d07"},
      interruptedReason: {uuid: "e1d9ead2-1d5f-11e0-b929-000c29ad1d07"},
      changeReason: {uuid: "e1de8862-1d5f-11e0-b929-000c29ad1d07"},
      dosageAmount: {uuid: "e1de8966-1d5f-11e0-b929-000c29ad1d07"},
      dosingUnits: {uuid: "9d66a447-10e8-11e5-9009-0242ac110012"},
      dosgeFrequency: {uuid: "5368f4d6-10e7-11e5-9009-0242ac110012"},
      drugRoute: {uuid: "9d6a9238-10e8-11e5-9009-0242ac110012"},
      duration: {uuid: "e1de27a0-1d5f-11e0-b929-000c29ad1d07"},
      durationUnits: {uuid: "9d6f0bea-10e8-11e5-9009-0242ac110012"},
      dosingInstructions: {uuid: "9d73c2a7-10e8-11e5-9009-0242ac110012"}
    })
    .constant('therapeuticLineQuestion', {
      firstLine: "a6bbe1ac-5243-40e4-98cb-7d4a1467dfbe",
      secondLine: "7f367983-9911-4f8c-bbfc-a85678801f64",
      thirdLine: "ade7656f-0ce3-461b-b7d8-121932dcd6a2"
    })
    .constant('arvConceptUuid', 'e1d83d4a-1d5f-11e0-b929-000c29ad1d07')
    .constant('arvRegimensConvSet', '7d5728ac-730f-495e-8368-73fc3d7e3c45')
    .constant('regimenGroups', {
      adult: {
        firstLine: "dde41a1c-6cb9-45ef-a315-6ac35456e7c1",
        secondLine: "618650c6-90c3-4acd-ae4d-ffb2f6452a5b",
        thirdLine: "4281f035-183f-407d-8286-92613f3039c8"
      },
      child: {
        firstLine: "0bd068da-1c57-40aa-9e05-f2bcbe282521",
        secondLine: "79c143ea-eeeb-4cdb-bfd7-fed8f029c15b"
      }
    })
    .constant('artInterruptedPlanUuid', 'e1d9f36a-1d5f-11e0-b929-000c29ad1d07');

})();
