(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('dispensationService', dispensationService);

  dispensationService.$inject = ['$http', '$q', '$log'];

  function dispensationService($http, $q, $log) {
    return {
      createDispensation: createDispensation
    };

    ////////////////

    /**
     * Creates a Pharmacy Dispensation.
     *
     * @param {Object} dispensation
     * @returns {String} Created Dispensation UUID.
     */
    function createDispensation(dispensation) {
      return $http.post(Bahmni.Common.Constants.dispensationUrl, dispensation, {
        withCredentials:true,
        headers: {"Accept": "application/json", "Content-Type": "application/json"}
      }).then(function (data) {
        return data.data.uuid;
      }).catch(function (error) {
        $log.error('XHR Failed for createDispensation. ' + error.data);
        return $q.reject(error);
      });
    }
  }

})();
