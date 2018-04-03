(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('testService', testService);

  testService.$inject = ['$http', '$log'];

  function testService($http, $log) {

    var OPENMRS_TEST_URL = "/openmrs/ws/rest/v1/testrequest";

    var CONFIG = {
      method: "GET",
      params: { v: "full" },
      withCredentials: true
    };

    return { getTests: getTests };

    function getTests() {
      return $http.get(OPENMRS_TEST_URL, CONFIG).then(function (response) {
        return response.data.results;
      });
    }

  }

})();
