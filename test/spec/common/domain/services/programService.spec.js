'use strict';

describe('programService', function () {

    var rootScope, mockBackend;

    var programService;
    var appService = jasmine.createSpyObj('appService', ['getAppDescriptor']);
    var DateUtil = Bahmni.Common.Util.DateUtil;

    var mockAppDescriptor = jasmine.createSpyObj('appService', ['getConfigValue']);
    mockAppDescriptor.getConfigValue.and.returnValue(undefined);

    var mockAppService = jasmine.createSpyObj('appDescriptor', ['getAppDescriptor']);
    mockAppService.getAppDescriptor.and.returnValue(mockAppDescriptor);

    beforeEach(function () {
        appService.getAppDescriptor.and.returnValue({
            getConfig: function () {
                return {
                    program: ""
                }
            },
            getConfigValue: function () {
                return {
                    mandatoryProgramAttributes: ""
                }
            }
        });

        module('bahmni.common.domain');
        module('bahmni.common.uicontrols.programmanagment');
        module(function ($provide) {
            $provide.value('appService', appService);
        });

        inject(function (_$rootScope_, _programService_, $httpBackend) {
            rootScope = _$rootScope_;
            programService = _programService_;
            mockBackend = $httpBackend
        });
    });

    it('should fetch all programs from backend and filter programs containing retired workflows and outcomes', function () {
        var allPrograms = [
            {
                "uuid": "someProgram1Uuid",
                "name": "Test Program 1",
                "retired": false,
                "outcomesConcept": {
                    "uuid": "someOutcomeUuid",
                    "retired": false,
                    "setMembers": [
                        {
                            "uuid": "8a1ab485-e599-4682-8c82-c60ce03c916e",
                            "display": "Cured",
                            "retired": false
                        },
                        {
                            "uuid": "041daad2-198b-4223-aa46-6b23e85776a9",
                            "display": "Death",
                            "retired": true
                        }
                    ]
                },
                "allWorkflows": [
                    {
                        "uuid": "someWorkFlowUuid",
                        "retired": false,
                        "states": [{
                            "uuid": "state1Uuid",
                            "retired": false
                        }, {
                            "uuid": "state2Uuid",
                            "retired": true
                        }]
                    }
                ]
            },
            {
                "uuid": "someProgram2Uuid",
                "name": "Test Program 2",
                "retired": true,
                "outcomesConcept": {
                    "uuid": "someOutcomeUuid",
                    "retired": true
                },
                "allWorkflows": [
                    {
                        "uuid": "someWorkFlowUuid",
                        "retired": true,
                        "states": [{
                            "uuid": "state1Uuid",
                            "retired": false
                        }, {
                            "uuid": "state2Uuid",
                            "retired": false
                        }]
                    }
                ]
            }
        ];

        mockBackend.expectGET('/openmrs/ws/rest/v1/program?v=default').respond({results: allPrograms});

        programService.getAllPrograms().then(function (response) {
            expect(response.length).toBe(1);
            expect(response[0].allWorkflows[0].states.length).toBe(1);
        });

        mockBackend.flush();
    });

    it("should group all programs into active/ended programs and sort them according to their dateEnrolled/dateCompleted respectively", function () {
        var patientUuid = "somePatientUuid";

        var today = DateUtil.endOfToday();
        var yesterday = DateUtil.addDays(today, -1);
        var tenDaysAgo = DateUtil.addDays(today, -10);
        var fiveDaysFromToday = DateUtil.addDays(today, 5);

        var data = {
            data: {
                results: [
                    {
                        "display": "Tuberculosis Program",
                        "dateEnrolled": DateUtil.parseLongDateToServerFormat(tenDaysAgo),
                        "dateCompleted": DateUtil.parseLongDateToServerFormat(yesterday),
                        "patient": {"uuid": "ad95e200-6196-4438-a078-16ad0506a473"},
                        "states": [
                            {
                                state: {uuid: '1911a3ef-cfab-43c5-8810-7f594bfa8995'},
                                startDate: "2015-07-01",
                                endDate: "2015-07-15"
                            },
                            {
                                state: {uuid: '1317ab09-52b4-4573-aefa-7f6e7bdf6d61'},
                                startDate: "2015-07-15",
                                endDate: null
                            }
                        ],
                        "program": {
                            "name": "program",
                            "uuid": "1209df07-b3a5-4295-875f-2f7bae20f86e",
                            "retired": false,
                            "allWorkflows": [
                                {
                                    "uuid": "6a6c990f-01e2-464b-9452-2a97f0c05c7c",
                                    "retired": false,
                                    "states": []
                                }
                            ]
                        },
                        "outcome": null
                    },
                    {
                        "display": "HIV Program",
                        "dateEnrolled": DateUtil.parseLongDateToServerFormat(tenDaysAgo),
                        "dateCompleted": DateUtil.parseLongDateToServerFormat(today),
                        "patient": {"uuid": "ad95e200-6196-4438-a078-16ad0506a473"},
                        "states": [
                            {
                                state: {uuid: '1911a3ef-cfab-43c5-8810-7f594bfa8995'},
                                startDate: "2015-07-01",
                                endDate: "2015-07-15"
                            },
                            {
                                state: {uuid: '1317ab09-52b4-4573-aefa-7f6e7bdf6d61'},
                                startDate: "2015-07-15",
                                endDate: null
                            }
                        ],
                        "program": {
                            "name": "program",
                            "uuid": "1209df07-b3a5-4295-875f-2f7bae20f86e",
                            "retired": false,
                            "allWorkflows": [
                                {
                                    "uuid": "6a6c990f-01e2-464b-9452-2a97f0c05c7c",
                                    "retired": false,
                                    "states": []
                                }
                            ]
                        },
                        "outcome": null
                    },
                    {
                        "display": "End TB Program",
                        "dateEnrolled": DateUtil.parseLongDateToServerFormat(tenDaysAgo),
                        "dateCompleted": DateUtil.parseLongDateToServerFormat(fiveDaysFromToday),
                        "patient": {"uuid": "ad95e200-6196-4438-a078-16ad0506a473"},
                        "states": [
                            {
                                state: {uuid: '1911a3ef-cfab-43c5-8810-7f594bfa8995'},
                                startDate: "2015-07-01",
                                endDate: "2015-07-15"
                            },
                            {
                                state: {uuid: '1317ab09-52b4-4573-aefa-7f6e7bdf6d61'},
                                startDate: "2015-07-15",
                                endDate: null
                            }
                        ],
                        "program": {
                            "name": "program",
                            "uuid": "1209df07-b3a5-4295-875f-2f7bae20f86e",
                            "retired": false,
                            "allWorkflows": [
                                {
                                    "uuid": "6a6c990f-01e2-464b-9452-2a97f0c05c7c",
                                    "retired": false,
                                    "states": []
                                }
                            ]
                        },
                        "outcome": null
                    },
                    {
                        "display": "End Fever Program",
                        "dateEnrolled": DateUtil.parseLongDateToServerFormat(tenDaysAgo),
                        "dateCompleted": null,
                        "patient": {"uuid": "ad95e200-6196-4438-a078-16ad0506a473"},
                        "states": [
                            {
                                state: {uuid: '1911a3ef-cfab-43c5-8810-7f594bfa8995'},
                                startDate: "2015-07-01",
                                endDate: "2015-07-15"
                            },
                            {
                                state: {uuid: '1317ab09-52b4-4573-aefa-7f6e7bdf6d61'},
                                startDate: "2015-07-15",
                                endDate: null
                            }
                        ],
                        "program": {
                            "name": "program",
                            "uuid": "1209df07-b3a5-4295-875f-2f7bae20f86e",
                            "retired": false,
                            "allWorkflows": [
                                {
                                    "uuid": "6a6c990f-01e2-464b-9452-2a97f0c05c7c",
                                    "states": []
                                }
                            ]
                        },
                        "outcome": null
                    }
                ]
            }
        };
        
        mockBackend.whenGET('/openmrs/ws/rest/v1/programenrollment?patient=somePatientUuid&v=full').respond(data.data);

        programService.getPatientPrograms(patientUuid).then(function (response) {

            expect(response.activePrograms[0].display).toEqual("End Fever Program");
            expect(response.endedPrograms[0].display).toEqual("End TB Program");
        });

        mockBackend.flush();

    });

    it('should enroll patient to a program', function () {
        var patientUuid = "somePatientUuid";
        var programUuid = "someProgramUuid";
        var dateEnrolled = "Fri Dec 11 2015 12:04:23 GMT+0530 (IST)";
        var workflowUuid = "someWorkflowUuid";
        var patientProgramAttributes = {locationName: 'alps'};
        var programAttributeTypes = [{
            uuid: '82325788-3f10-11e4-adec-0800271c1b75',
            sortWeight: 3,
            name: 'locationName',
            description: 'Location of the patient program',
            format: 'java.lang.String',
            answers: [],
            required: false
        }];

        mockBackend.whenPOST('/openmrs/ws/rest/v1/programenrollment').respond(function (method, url, data, headers) {
            expect(method).toEqual('POST');
            data = JSON.parse(data);
            expect(url).toEqual(Bahmni.Common.Constants.programEnrollPatientUrl);
            expect(data.patient).toEqual(patientUuid);
            expect(data.program).toEqual(programUuid);
            expect(moment(data.dateEnrolled).isSame(moment("2015-12-11T12:04:23+0530"))).toBe(true);

            expect(data.states[0].state).toEqual(workflowUuid);
            expect(moment(data.states[0].startDate).isSame(moment("2015-12-11T12:04:23+0530"))).toBe(true);

            return [200, {}, {}];
        });

        programService.enrollPatientToAProgram(patientUuid, programUuid, dateEnrolled, workflowUuid, patientProgramAttributes, programAttributeTypes);

        mockBackend.flush();

    });

    it('should delete patient state', function () {
        var patientProgramUuid = "somePatientProgramUuid";
        var patientStateUuid = "someStateUuid";
        programService.deletePatientState(patientProgramUuid, patientStateUuid).success(function (response) {
            expect(response.reason).toEqual("User deleted the state.");
        });
        mockBackend.when('DELETE', '/openmrs/ws/rest/v1/programenrollment/somePatientProgramUuid/state/someStateUuid').respond(function (method, url) {
            expect(url).toEqual(Bahmni.Common.Constants.programEnrollPatientUrl + "/" + patientProgramUuid + "/state/" + patientStateUuid);
            return [200, {"reason": "User deleted the state."}, {}];

        });
        mockBackend.flush();


    });

    it('test savePatientProgram', function () {
        var patientProgramUuid = "somePatientProgramUuid";
        var content = "SampleContent";

        mockBackend.whenPOST('/openmrs/ws/rest/v1/programenrollment/somePatientProgramUuid').respond(function (method, url, data, headers) {
            expect(url).toEqual(Bahmni.Common.Constants.programEnrollPatientUrl + "/" + patientProgramUuid);
            expect(JSON.parse(data).states[0].state.uuid).toEqual(content);
            return [200, {}, {}];
        });
        programService.savePatientProgram(patientProgramUuid, content);
        mockBackend.flush();

    });
});
