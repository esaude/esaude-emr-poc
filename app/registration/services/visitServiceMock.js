"use strict";

angular.module('registration').service('visitServiceMock', function () {
    this.getVisitTypes = function () {
        return visitTypes;
    };
    
    this.getPatientVisits = function () {
        return patientVisits;
    };
    
    this.addPatientVisit = function (patientId, visitType, dateStarted, dateStopped, location) {
        //last patient visit id
        var lastPatientVisitId = -1;
        if(patientVisits.length > 0) {
            lastPatientVisitId = patientVisits[patientVisits.length - 1];
        }
        
        var newPatientVisit = {id: lastPatientVisitId + 1, patientId: patientId, visitType: visitType, 
            dateStarted: dateStarted, dateStopped: dateStopped, location: location};
        
        patientVisits.push(newPatientVisit);
    };
    
    var visitTypes = [
        {id: 1, name: "PRIMEIRA VISITA (TARV)"},
        {id: 2, name: "VISITA DE SEGUIMENTO"},
        {id: 3, name: "VISITA DE LAB"},
        {id: 4, name: "VISITA DE FARMACIA"},
        {id: 5, name: "VISITA DE ACONSELHAMENTO"}
    ];
    
    var patientVisits = [
        {id: 1, patientId: 1, visitType: visitTypes[0], dateStarted: "2015-01-04 :12:30:00", dateStopped: "2015-01-04 :14:30:00", location: "Location A"},
        {id: 2, patientId: 1, visitType: visitTypes[1], dateStarted: "2015-02-04 :12:30:00", dateStopped: "2015-01-04 :14:30:00", location: "Location A"}
    ];
});