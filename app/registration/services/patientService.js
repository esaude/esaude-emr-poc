'use strict';

angular.module('registration')
    .factory('patientService', ['$http', '$rootScope', function ($http, $rootScope) {
        var openmrsUrl = Bahmni.Registration.Constants.openmrsUrl;
        var baseOpenMRSRESTURL = Bahmni.Registration.Constants.baseOpenMRSRESTURL;

        var search = function (query) {
            return $http.get(openmrsUrl + "/ws/rest/v1/patient", {
                method: "GET",
                params: {
                    q: query,
                    identifier: query,
                    v: "full"
                     },
                withCredentials: true
            });
        };
        
        var getIdentifierTypes = function () {
            return $http.get(openmrsUrl + "/ws/rest/v1/patientidentifiertype", {
                method: "GET",
                params: {v: "full"},
                withCredentials: true
            });
        };

        var get = function (uuid) {
            return $http.get(openmrsUrl + "/ws/rest/v1/patient/" + uuid, {
                method: "GET",
                params: {v: "full"},
                withCredentials: true
            });
        };
        
        var getPatientIdentifiers = function (patientUuid) {
            return $http.get(openmrsUrl + "/ws/rest/v1/patient/" + patientUuid + "/identifier", {
                method: "GET",
                withCredentials: true
            });
        };

        var generateIdentifier = function (patient) {
            var idgenJson = {"identifierSourceName": patient.identifierPrefix.prefix};
            return $http.post(openmrsUrl + "/ws/rest/v1/idgen", idgenJson, {
                withCredentials: true,
                headers: {"Accept": "text/plain", "Content-Type": "application/json"}
            });
        };

        var create = function (patient) {
            var patientJson = new Bahmni.Registration.CreatePatientRequestMapper(moment()).mapFromPatient($rootScope.patientConfiguration.personAttributeTypes, patient);
            return $http.post(baseOpenMRSRESTURL + "/patientprofile", patientJson, {
                withCredentials: true,
                headers: {"Accept": "application/json", "Content-Type": "application/json"}
            });
        };
//
//        var update = function (patient, openMRSPatient) {
//            var patientJson = new Bahmni.Registration.UpdatePatientRequestMapper(moment()).mapFromPatient($rootScope.patientConfiguration.personAttributeTypes, openMRSPatient, patient);
//            return $http.post(baseOpenMRSRESTURL + "/patientprofile/" + openMRSPatient.uuid, patientJson, {
//                withCredentials: true,
//                headers: {"Accept": "application/json", "Content-Type": "application/json"}
//            });
//        };
//
//        var updateImage = function (uuid, image) {
//            var updateImageUrl = baseOpenMRSRESTURL + "/personimage/";
//            var imageRequest = {
//                "person": {
//                    "uuid": uuid
//                },
//                "base64EncodedImage": image
//            };
//            return $http.post(updateImageUrl, imageRequest, {
//                withCredentials: true,
//                headers: {"Accept": "application/json", "Content-Type": "application/json"}
//            });
//        };

        return {
            search: search,
            getIdentifierTypes: getIdentifierTypes,
            create: create,
            generateIdentifier: generateIdentifier,
//            update: update,
            get: get,
            getPatientIdentifiers: getPatientIdentifiers
//            updateImage: updateImage
        };
    }]);
