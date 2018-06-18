(() => {
  'use strict';

  angular
    .module('poc.common.visit')
    .factory('visitService', visitService);

  visitService.$inject = ['$http', '$log', '$q', 'appService', 'commonService', 'encounterService', 'observationsService', 'sessionService'];

  /* @ngInject */
  function visitService($http, $log, $q, appService, commonService, encounterService, observationsService, sessionService) {

    var WEIGHT_KG = "e1e2e826-1d5f-11e0-b929-000c29ad1d07";

    var HEIGHT_CM = "e1e2e934-1d5f-11e0-b929-000c29ad1d07";

    var sortByVisitStartDateTime = _.curryRight(_.sortBy, 2)(visit => new Date(visit.startDatetime));

    var service = {
      create: create,
      checkInPatient: checkInPatient,
      deleteVisit: deleteVisit,
      getPatientLastVisit: getPatientLastVisit,
      getTodaysVisit: getTodaysVisit,
      getVisitHeader: getVisitHeader,
      getVisitHistoryForPatient: getVisitHistoryForPatient,
      search: search
    };
    return service;

    ////////////////

    function create(checkin) {
      return $http.post(Bahmni.Common.Constants.checkinUrl, checkin, {
        withCredentials: true,
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
      }).then(response => response.data).catch(error => {
        $log.error('XHR Failed for create: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function checkInPatient(patient) {
      var currentLocation = sessionService.getCurrentLocation();
      if (currentLocation) {
        var checkin = {
          patient: patient.uuid,
          location: currentLocation.uuid,
          module: appService.getAppDescriptor().id
        };
        return create(checkin);
      } else {
        $log.error('checkInPatient: No current location defined.');
        return $q.reject();
      }
    }

    function deleteVisit(visit) {
      return $http.delete(Bahmni.Common.Constants.visitUrl + '/' + visit.uuid, {params: {purge: true}})
        .then(response => response.data)
        .catch(error => {
          $log.error('XHR Failed for delete: ' + error.data.error.message);
          return $q.reject(error.data.error.message.replace('[','').replace(']',''));
        });
    }

    function getPatientLastVisit(patient) {
      if (!patient.uuid) {
        $log.error('getPatientLastVisit: No patient uuid defined.');
        return $q.reject();
      }
      var parameters = { patient: patient.uuid, voided: false, mostRecentOnly: true, v: "custom:(visitType:(name),startDatetime,stopDatetime,uuid)" };
      return search(parameters)
        .then(visits => {
          if (visits.length > 0) {
            return visits[0];
          }
          return null;
        });
    }

    function getTodaysVisit(patientUUID) {
      if (patientUUID) {
        var parameters = { patient: patientUUID, voided: false, mostRecentOnly: true, currentDateOnly: true, v: "full" };
        return search(parameters)
          .then(visits => {
            if (visits.length > 0) {
              return visits[0];
            }
            return null;
          })
          .catch(error => {
            $log.error('XHR Failed for getTodaysVisit: ' + error.data.error.message);
            return $q.reject(error);
          });
      } else {
        return $q.reject();
      }
    }


    function getPatientLastBMI(patient) {
      var getHeightCM = observationsService.getLastPatientObs(patient, { uuid: HEIGHT_CM }, 'custom:(uuid,display,value,obsDatetime)');
      var getWeightKg = observationsService.getLastPatientObs(patient, { uuid: WEIGHT_KG }, 'custom:(uuid,display,value)');
      return $q.all([getHeightCM, getWeightKg])
        .then(result => {
          var heightCMObs = result[0];
          var weightKgObs = result[1];
          if (!heightCMObs || !weightKgObs) {
            return null;
          }
          var heightM = heightCMObs.value / 100;
          return {
            value: weightKgObs.value / (heightM * heightM),
            obsDatetime: heightCMObs.obsDatetime
          };
        });
    }

    function getVisitHeader(patient) {

      var visitHeader = {};

      var getConsultations =
        encounterService.getPatientFollowupEncounters(patient, 'custom:encounterDatetime,provider:(display),obs:(uuid,value,concept:(uuid,display))')
          .then(followupEncounters => {
            var last = followupEncounters[0];
            if (last) {
              visitHeader.lastConsultation = followupEncounters[0];
              visitHeader.nextConsultation = encounterService.getNextConsultationDate(last);
            }
          });

      var getPharmacyEncounters =
        encounterService.getPatientPharmacyEncounters(patient, 'custom:encounterDatetime,provider:(display),obs:(uuid,value,concept:(uuid,display))')
          .then(filaEncounters => {
            var last = filaEncounters[0];
            if (last) {
              visitHeader.lastPharmacy = last;
              visitHeader.nextPharmacy = encounterService.getNextPickupDate(last);
            }
          });

      var getLastBmi = getPatientLastBMI(patient)
        .then(lastBmi => {
          visitHeader.lastBmi = lastBmi;
        });



      var getLastVisit = getPatientLastVisit(patient).then(lastVisit => {
        visitHeader.lastVisit = lastVisit;
      });

      return $q.all([getPharmacyEncounters, getConsultations, getLastBmi, getLastVisit])
        .then(() => visitHeader)
        .catch(error => {
          $log.error('XHR Failed for getVisitHeader: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function search(params) {
      return $http.get(Bahmni.Common.Constants.visitUrl, {
        params: params,
        withCredentials: true
      })
        .then(response => response.data.results)
        .catch(error => {
          $log.error('XHR Failed for search: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getVisitHistoryForPatient(patient) {
      return encounterService.getEncountersOfPatient(patient.uuid).then(response => commonService.filterGroupReverse(response.data));
    }

  }

})();

