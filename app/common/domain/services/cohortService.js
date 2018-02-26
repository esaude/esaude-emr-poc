(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('cohortService', cohortService);

  cohortService.$inject = ['$http', '$log', '$q'];

  /* @ngInject */
  function cohortService($http, $log, $q) {
    var service = {
      evaluateCohort: evaluateCohort
    };
    return service;

    ////////////////

    function evaluateCohort(cohortUuid, params) {
      var config = {
        params: params
      };
      return $http.get(Bahmni.Common.Constants.cohortUrl + "/" + cohortUuid, config).then(function (response) {
        return response.data.members;
      }).catch(function (error) {
        $log.error('XHR Failed for evaluateCohort: ' + error.data.error.message);
        return $q.reject(error);
      });
    }
  }

})();
