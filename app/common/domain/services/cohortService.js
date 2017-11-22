(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('cohortService', cohortService);

  cohortService.$inject = ['$http', '$log', '$q'];

  /* @ngInject */
  function cohortService($http, $log, $q) {
    var service = {
      getMarkedForConsultationToday: getMarkedForConsultationToday
    };
    return service;

    ////////////////

    function evaluateCohort(cohortUuid) {
      return $http.get(Bahmni.Common.Constants.cohortUrl + "/" + cohortUuid, {
        method: "GET",
        withCredentials: true
      }).then(function (response) {
        return response.data.members;
      }).catch(function (error) {
        $log.error('XHR Failed for evaluateCohort: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function getMarkedForConsultationToday() {
      return evaluateCohort(Bahmni.Common.Constants.cohortMarkedForConsultationUuid);
    }
  }

})();

