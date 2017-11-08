(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('consultationService', consultationService);

  consultationService.$inject = ['$http', '$log', '$q'];

  /* @ngInject */
  function consultationService($http, $log, $q) {

    var CONSULTATION_SUMMARY_REPRESENTATION = 'custom:(consultationDate,patientConsultations:(checkInOnConsultationDate))';

    var service = {
      getWeeklyConsultationSummary: getWeeklyConsultationSummary,
      getMonthlyConsultationSummary: getMonthlyConsultationSummary
    };
    return service;

    ////////////////

    function getMonthlyConsultationSummary(location) {
      var today = moment().startOf('day');
      var oneMonthAgo = today.clone().subtract(1, 'months');

      var consultationSummary = {
        startDate: oneMonthAgo.toDate(),
        endDate: today.toDate(),
        summary: []
      };

      return getPatientConsultationSummary(location, oneMonthAgo, today, CONSULTATION_SUMMARY_REPRESENTATION)
        .then(function (summary) {
          consultationSummary.summary = summary;
          return consultationSummary;
        })
        .catch(function (error) {
          error.data.consultationSummary = consultationSummary;
          return $q.reject(error.data);
        });
    }


    function getWeeklyConsultationSummary(location) {
      var today = moment().startOf('day');
      var oneWeekAgo = today.clone().subtract(7, 'days');

      var consultationSummary = {
        startDate: oneWeekAgo.toDate(),
        endDate: today.toDate(),
        summary: []
      };

      return getPatientConsultationSummary(location, oneWeekAgo, today, CONSULTATION_SUMMARY_REPRESENTATION)
        .then(function (summary) {
          consultationSummary.summary = summary;
          return consultationSummary;
        })
        .catch(function (error) {
          error.data.consultationSummary = consultationSummary;
          return $q.reject(error.data);
        });
    }

    function getPatientConsultationSummary(location, startDate, endDate, representation) {
      var config = {
        params: {
          location: location.uuid,
          startDate: startDate.toDate(),
          endDate: endDate.toDate()
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

