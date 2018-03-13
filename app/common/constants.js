var Bahmni = Bahmni || {};
Bahmni.Common = Bahmni.Common || {};

(function(){
    var RESTWS = "/openmrs/ws/rest";
    var RESTWS_V1 = "/openmrs/ws/rest/v1";
    var EMRAPI = RESTWS + "/emrapi";
    var BACTERIOLOGY = RESTWS_V1;

    var representation = "custom:(uuid,name,names,conceptClass," +
        "setMembers:(uuid,name,names,conceptClass," +
        "setMembers:(uuid,name,names,conceptClass," +
        "setMembers:(uuid,name,names,conceptClass))))";

    var messageTypeRepresentation = {
        "feb94661-9f27-4a63-972f-39ebb63c7022": "success",
        "a1822bef-5bef-44b5-89d7-9dcf261731c1": "info",
        "5456047f-8e81-4f68-b061-5ee10a2f0a11": "warning",
        "9b9c21dc-e1fb-4cd9-a947-186e921fa78c": "error"
    };

    var regimenGroups = {
        adult: {
            firstLine: "dde41a1c-6cb9-45ef-a315-6ac35456e7c1",
            secondLine: "618650c6-90c3-4acd-ae4d-ffb2f6452a5b",
            thirdLine: "4281f035-183f-407d-8286-92613f3039c8"
        },
        child: {
            firstLine: "0bd068da-1c57-40aa-9e05-f2bcbe282521",
            secondLine: "79c143ea-eeeb-4cdb-bfd7-fed8f029c15b"
        }
    };

    var drugPrescriptionConvSet = {
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
    };

    var therapeuticLineQuestion = {
        firstLine: "a6bbe1ac-5243-40e4-98cb-7d4a1467dfbe",
        secondLine: "7f367983-9911-4f8c-bbfc-a85678801f64",
        thirdLine: "ade7656f-0ce3-461b-b7d8-121932dcd6a2"
    };

    var prophilaxyDrugConcepts = ["e1d6b6dc-1d5f-11e0-b929-000c29ad1d07", "e1cf3114-1d5f-11e0-b929-000c29ad1d07",
                "e1d4a7d4-1d5f-11e0-b929-000c29ad1d07", "e1d43e52-1d5f-11e0-b929-000c29ad1d07"];

    Bahmni.Common.Constants = {
        dateFormat: "dd/mm/yyyy",
        dateDisplayFormat: "DD-MMM-YYYY",
        timeDisplayFormat: "hh:mm",
        emrapiDiagnosisUrl : EMRAPI + "/diagnosis",
        emrapiConceptUrl :EMRAPI + "/concept",
        emrEncounterUrl: EMRAPI + "/encounter",
        encounterUrl: RESTWS_V1 + "/encounter",
        locationUrl: RESTWS_V1 + "/location",
        orderUrl: RESTWS_V1 + "/order",
        drugUrl: RESTWS_V1 + "/drug",
        drugResourceUrl: RESTWS_V1 + "/drugresource",
        drugOrderResourceUrl :RESTWS_V1 + "/drugorderresource",
        drugRegimenUrl: RESTWS_V1 + "/drugregime",
        arvDrugUrl: RESTWS_V1 + "/arvdrug",
        conceptUrl: RESTWS_V1 + "/concept",
        conceptSearchByFullNameUrl: RESTWS_V1 + "/concept?s=byFullySpecifiedName",
        visitUrl: RESTWS_V1 + "/visit",
        visitTypeUrl: RESTWS_V1 + "/visittype",
        patientImageUrl: "/patient_images/",
        labResultUploadedFileNameUrl: "/uploaded_results/",
        openmrsUrl: "/openmrs",
        idgenConfigurationURL: RESTWS_V1 + "/idgen/identifiersources",
        dhisAllTasksUrl: RESTWS_V1 + "/dhis/tasks",
        programUrl: RESTWS_V1 + "/program",
        programEnrollPatientUrl: RESTWS_V1 + "/programenrollment",
        programEnrollmentDefaultInformation: "default",
        programEnrollmentFullInformation: "full",
        dhisTaskUrl: RESTWS_V1 + "/dhis/task/",
        dhisFireQueriesUrl: RESTWS_V1 + "/dhis/fireQueries",
        relationshipTypesUrl: RESTWS_V1 + "/relationshiptype",
        personAttributeTypeUrl: RESTWS_V1 + "/personattributetype",
        allTestsAndPanelsConceptName : 'All_Tests_and_Panels',
        dosageFrequencyConceptName : 'Dosage Frequency',
        dosageInstructionConceptName : 'Dosage Instructions',
        consultationNoteConceptName : 'Consultation Note',
        diagnosisConceptSet : 'Diagnosis Concept Set',
        radiologyOrderType : 'Radiology Order',
        radiologyResultConceptName :"Radiology Result",
        investigationEncounterType:"INVESTIGATION",
        validationNotesEncounterType: "VALIDATION NOTES",
        labOrderNotesConcept: "Lab Order Notes",
        impressionConcept: "Impression",
        qualifiedByRelationshipType: "qualified-by",
        dispositionConcept : "Disposition",
        dispositionGroupConcept : "Disposition Set",
        dispositionNoteConcept : "Disposition Note",
        ruledOutDiagnosisConceptName : 'Ruled Out Diagnosis',
        emrapiConceptMappingSource :"org.openmrs.module.emrapi",
        includeAllObservations: false,
        openmrsObsUrl :RESTWS_V1 + "/obs",
        openmrsObsRepresentation :"custom:(uuid,obsDatetime,value:(uuid,name:(uuid,name)))" ,
        admissionCode: 'ADMIT',
        dischargeCode: 'DISCHARGE',
        transferCode: 'TRANSFER',
        undoDischargeCode: 'UNDO_DISCHARGE',
        vitalsConceptName: "Vitals",
        heightConceptName: "HEIGHT",
        weightConceptName: "WEIGHT",
        bmiConceptName: "BMI", // TODO : shruthi : revove this when this logic moved to server side
        bmiStatusConceptName: "BMI STATUS", // TODO : shruthi : revove this when this logic moved to server side
        abnormalObservationConceptName: "IS_ABNORMAL",
        documentsPath: '/document_images',
        documentsConceptName: 'Document',
        miscConceptClassName: 'Misc',
        abnormalConceptClassName: 'Abnormal',
        durationConceptClassName: 'Duration',
        conceptDetailsClassName: 'Concept Details',
        admissionEncounterTypeName: 'ADMISSION',
        dischargeEncounterTypeName: 'DISCHARGE',
        imageClassName: 'Image',
        locationCookieName: 'bahmni.user.location',
        retrospectiveEntryEncounterDateCookieName: 'bahmni.clinical.retrospectiveEncounterDate',
        rootScopeRetrospectiveEntry: 'retrospectiveEntry.encounterDate',
        patientFileConceptName: 'Patient file',
        currentUser:'user',
        retrospectivePrivilege:'app:clinical:retrospective',
        nutritionalConceptName:'Nutritional Values',
        messageForNoObservation: "No observations captured for this visit.",
        messageForNoDisposition: "NO_DISPOSTIONS_AVAILABLE_MESSAGE_KEY",
        messageForNoFulfillment: "No observations captured for this order.",
        reportsUrl: "/bahmnireports/report",
        uploadReportTemplateUrl: "/bahmnireports/upload",
        ruledOutdiagnosisStatus : "Ruled Out Diagnosis",
        registartionConsultationPrivilege:'app:common:registration_consultation_link',
        manageIdentifierSequencePrivilege:"Manage Identifier Sequence",
        closeVisitPrivilege:'app:common:closeVisit',
        deleteDiagnosisPrivilege:'app:clinical:deleteDiagnosis',
        viewPatientsPrivilege: 'View Patients',
        editPatientsPrivilege: 'Edit Patients',
        addVisitsPrivilege: 'Add Visits',
        deleteVisitsPrivilege: 'Delete Visits',
        grantProviderAccess: "app:clinical:grantProviderAccess",
        grantProviderAccessDataCookieName: "app:clinical:grantProviderAccessData",
        fulfillmentConfiguration: "fulfillment",
        fulfillmentFormSuffix:" Fulfillment Form",
        noNavigationLinksMessage: "No navigation links available.",
        conceptSetRepresentationForOrderFulfillmentConfig: representation,
        entityMappingUrl: RESTWS_V1 + "/entitymapping",
        encounterTypeUrl: RESTWS_V1+"/encountertype",
        cohortUrl: RESTWS_V1+"/reportingrest/cohort",
        defaultExtensionName: "default",
        bahmniBacteriologyResultsUrl: BACTERIOLOGY + "/specimen",
        formDataUrl: RESTWS_V1 + "/obs",
        adultFollowupEncounterUuid: "e278f956-1d5f-11e0-b929-000c29ad1d07",
        childFollowupEncounterUuid: "e278fce4-1d5f-11e0-b929-000c29ad1d07",
        pocCurrentStoryEncounterUuid: "782da6c5-3931-4ab5-8e10-2c647ee1cf9d",
        typeOfMessageConceptUuid: "fbe61748-a080-4eef-bfff-c47954794f10",
        observationStoryConceptuuid: "694d4767-d8c4-40e2-a68b-a8f3bac8524a",
        successConceptuuid: "feb94661-9f27-4a63-972f-39ebb63c7022",
        informationConceptuuid: "a1822bef-5bef-44b5-89d7-9dcf261731c1",
        warningConceptUuid: "5456047f-8e81-4f68-b061-5ee10a2f0a11",
        errorConceptUuid: "9b9c21dc-e1fb-4cd9-a947-186e921fa78c",
        messageTypeRepresentation: messageTypeRepresentation,
        cohortMarkedForConsultationUuid: "eca2b927-4ee3-47e3-9c19-a72805891d8d",
        cohortMarkedForConsultationAndCheckedInUuid: "d00c4b2e-7c13-4d05-9f87-8a9c4b07ad52",
        nextConsultationDateUuid: "e1dae630-1d5f-11e0-b929-000c29ad1d07",
        providerUrl: RESTWS_V1 + "/provider",
        drugPrescriptionConvSet: drugPrescriptionConvSet,
        prescriptionConvSetConcept: "ac465c58-68ef-4a19-88ae-c7f72e89a2b2",
        followupAdultFormUuid: "e28aa7aa-1d5f-11e0-b929-000c29ad1d07",
        followupChildFormUuid: "e28ac028-1d5f-11e0-b929-000c29ad1d07",
        artInterruptedPlanUuid: "e1d9f36a-1d5f-11e0-b929-000c29ad1d07",
        isoniazidStartDateUuid: "6fa92ac9-0a96-4372-9e10-dd9683c19135",
        isoniazidEndDateUuid: "9e555978-3a02-4da4-855e-7b1bfc807347",
        prophilaxyDrugConcepts: prophilaxyDrugConcepts,
        therapeuticLineQuestion: therapeuticLineQuestion,
        ADULT_FOLLOWUP_ENCOUTER_UUID: "e278f956-1d5f-11e0-b929-000c29ad1d07",
        CHILD_FOLLOWUP_ENCOUNTER_UUID: "e278fce4-1d5f-11e0-b929-000c29ad1d07",
        LAB_ENCOUNTER_TYPE_UUID: "e2790f68-1d5f-11e0-b929-000c29ad1d07",
        SYSTOLIC_BLOOD_PRESSURE: "e1e2e3d0-1d5f-11e0-b929-000c29ad1d07",
        DIASTOLIC_BLOOD_PRESSURE: "e1e2e4e8-1d5f-11e0-b929-000c29ad1d07",
        WEIGHT_KG: "e1e2e826-1d5f-11e0-b929-000c29ad1d07",
        HEIGHT_CM: "e1e2e934-1d5f-11e0-b929-000c29ad1d07",
        TEMPERATURE: "e1e2e70e-1d5f-11e0-b929-000c29ad1d07",
        FREQUENCIA_CARDIACA: "e1e2e5f6-1d5f-11e0-b929-000c29ad1d07",
        RESPIRATORY_RATE: "e1e4628c-1d5f-11e0-b929-000c29ad1d07",
        BMI: 'e1da52ba-1d5f-11e0-b929-000c29ad1d07',
        prescriptionUrl :RESTWS_V1 + "/prescription",
        dispensationUrl :RESTWS_V1 + "/dispensation",
        markedForPickupDrugsToday : "c23d5b4e-45c9-47ee-a506-e8f9662a5533",
        dispensationEncounterTypeUuid : "18fd49b7-6c2b-4604-88db-b3eb5b3a6d5f",
        arvConceptUuid: "e1d83d4a-1d5f-11e0-b929-000c29ad1d07",
        otherDrugsConceptUuid: "e1de3092-1d5f-11e0-b929-000c29ad1d07",
        arvRegimensConvSet: "7d5728ac-730f-495e-8368-73fc3d7e3c45",
        regimenGroups: regimenGroups,
        systemSetting: '/openmrs/ws/rest/v1/systemsetting',
        labEncounterUuid : 'e2790f68-1d5f-11e0-b929-000c29ad1d07'

    };
})();
