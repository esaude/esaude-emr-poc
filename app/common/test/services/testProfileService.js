(() => {
  'use strict';

  angular
    .module('common.test')
    .factory('testProfileService', testProfileService);

  testProfileService.$inject = ['$http', '$log'];

  function testProfileService($http, $log) {

    var TEST_PROFILE_FILE = "/poc_config/openmrs/apps/common/testProfile.json";

    var service = {
      getTestProfiles: getTestProfiles
    };
    return service;


    function getTestProfiles() {
      return $http.get(TEST_PROFILE_FILE)
        .then(response => response.data.testProfiles)
        .catch(error => {
          $log.error("The async call has fail to: " + TEST_PROFILE_FILE);
        });
    }
  }

})();
