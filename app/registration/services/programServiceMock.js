"use strict";

angular.module('registration').service('programServiceMock', function () {
    this.getPrograms = function () {
        return programs;
    };
    
    this.getProgramStates = function () {
        return programStates;
    };
    
    this.getPatientPrograms = function (patientId) {
        if(patientId === 0) {
            return -1;
        }
        
        var patientProgramByPatient = [];
        
        for(var i in patientPrograms) {
            if(patientPrograms[i].patientId === patientId) {
                patientProgramByPatient.push(patientPrograms[i]);
            }
        }
        return patientProgramByPatient;
    };
    
    this.addPatientProgram = function (patientId, program, admissionDate, location, state) {
        //last patient program id
        var lastPatientProgramId = -1;
        if(patientPrograms.length > 0) {
            lastPatientProgramId = patientPrograms[patientPrograms.length - 1];
        }
        
        var newPatientProgramState = null;
        if(state !== "undefined" && state !== null) {
            newPatientProgramState = addPatientProgramState(program.id, state, admissionDate);
        }
        
        var newProgram = {id: lastPatientProgramId + 1, patientId: patientId, program: program, 
            dateEnrolled: admissionDate, dateCompleted: null, location: location,  
            states: (newPatientProgramState === null) ? [] : [newPatientProgramState]};
        
        patientPrograms.push(newProgram);
    };
    
    function addPatientProgramState(programId, state, startDate) {
        //last patient program state id
        var lastPatientProgramStateId = -1;
        
        if(patientProgramStates.length > 0) {
            lastPatientProgramStateId = patientProgramStates[patientProgramStates.length - 1];
        }
        
        var newPatientProgramState = {id: lastPatientProgramStateId + 1, state: state, programId: programId, startDate: startDate, endDate: null};
        
        patientProgramStates.push(newPatientProgramState);
        
        return newPatientProgramState;
        
    };

    var programs = [
        {id: 1, name: "SERVICO TARV - CUIDADO"},
        {id: 2, name: "SERVICO TARV - TRATAMENTO"},
        {id: 5, name: "TUBERCULOSE"},
        {id: 6, name: "CCR"},
        {id: 8, name: "PTV/ETV"}
    ];
    
    var programStates = [
        {id: 1, name: "ACTIVO NO PROGRAMA"},
        {id: 2, name: "TRANSFERIDO DE"},
        {id: 3, name: "ABANDONO"},
        {id: 4, name: "OBITOU"},
        {id: 5, name: "TRANSFERIDO PARA"}
    ];
    
    var patientProgramStates = [
        {id: 1, state: programStates[0], programId: 1, startDate: "2011-01-12", endDate: "2014-01-12"},
        {id: 2, state: programStates[0], programId: 2, startDate: "2014-01-12", endDate: null}
    ];
    
    var patientPrograms = [
        {id: 1, patientId: 1, program: programs[0], dateEnrolled: "2011-01-12", dateCompleted: "2014-01-12", location: "Location A", states: [patientProgramStates[0]]},
        {id: 2, patientId: 1, program: programs[1], dateEnrolled: "2011-01-12", dateCompleted: null, location: "Location A",  states: [patientProgramStates[1]]},
        {id: 3, patientId: 1, program: programs[3], dateEnrolled: "2011-01-12", dateCompleted: null, location: "Location A",  states: [patientProgramStates[1]]},
        {id: 4, patientId: 1, program: programs[4], dateEnrolled: "2011-01-12", dateCompleted: null, location: "Location A",  states: [patientProgramStates[1]]}
    ];
});