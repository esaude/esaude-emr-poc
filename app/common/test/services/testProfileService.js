(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('testProfileService', testProfileService);

  testProfileService.$inject = ['$http', '$log'];

  function testProfileService($http, $log) {

    var TEST_PROFILE_FILE = "../common/test/resources/testProfile.json";

    var service = {
      getTestProfiles: getTestProfiles
    };
    return service;


    function getTestProfiles() {
      return $http.get(TEST_PROFILE_FILE)
        .then(function (response) {
          return response.data.testProfiles;
        })
        .catch(function (error) {
          $log.error("The async call has fail to: " + TEST_PROFILE_FILE);
        });
    }
  }

})();
