(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('consultationService', consultationService);

  consultationService.$inject = ['$http', '$log', '$q'];

  /* @ngInject */
  function consultationService($http, $log, $q) {

    var CONSULTATION_SUMMARY_REPRESENTATION = 'custom:(consultationDate,startDate,endDate,patientConsultations:(checkInOnConsultationDate))';

    var service = {
      getWeeklyConsultationSummary: getWeeklyConsultationSummary,
      getMonthlyConsultationSummary: getMonthlyConsultationSummary
    };
    return service;

    ////////////////

    function getMonthlyConsultationSummary(location) {
      return getPatientConsultationSummary(location, true, CONSULTATION_SUMMARY_REPRESENTATION)
        .then(function (summaries) {
          //we will allways have a first result even when there are no consultations
          return {
            startDate: moment(summaries[0].startDate),
            endDate: moment(summaries[0].endDate),
            summary: summaries
          };
        })
        .catch(function (error) {
          error.data.consultationSummary = consultationSummary;
          return $q.reject(error.data);
        });
    }


    function getWeeklyConsultationSummary(location) {
      return getPatientConsultationSummary(location, false, CONSULTATION_SUMMARY_REPRESENTATION)
        .then(function (summaries) {
          //we will allways have a first result even when there are no consultations
          return {
            startDate: moment(summaries[0].startDate),
            endDate: moment(summaries[0].endDate),
            summary: summaries
          };
        })
        .catch(function (error) {
          error.data.consultationSummary = consultationSummary;
          return $q.reject(error.data);
        });
    }

    function getPatientConsultationSummary(location, montly, representation) {
      var config = {
        params: {
          location: location.uuid,
          montly: montly
        }
      };
      // Endpoint does not have full support for representations.
      if (representation) {
        config.params.v = representation
      }
      return $http.get('/openmrs/ws/rest/v1/patientconsultationsummary', config).then(function (response) {
        return response.data.results;
      })
        .catch(function (error) {
          $log.error('XHR Failed for getPatientConsultationSummary. ' + error.data.error.message);
          return $q.reject(error);
        });
    }
  }

})();

