(() => {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('dispensationService', dispensationService);

  dispensationService.$inject = ['$http', '$q', '$log'];

  function dispensationService($http, $q, $log) {

    var OPENMRS_URL = Poc.Patient.Constants.openmrsUrl;

    return {
      createDispensation: createDispensation,
      cancelDispensationItem: cancelDispensationItem,
      getDispensation: getDispensation,
      getDefaultItemQuantityToDispense: getDefaultItemQuantityToDispense
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
      }).then(data => data.data.uuid).catch(error => {
        $log.error('XHR Failed for createDispensation: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function cancelDispensationItem(orderuuid, reason) {
      return $http.delete(Bahmni.Common.Constants.dispensationUrl + "/" + orderuuid, {
        params: {reason: reason}
      });
    }

    function getDispensation(patientUuid, startDate, endDate) {
      return $http.get(Bahmni.Common.Constants.dispensationUrl, {
        params: {
          patient: patientUuid,
          startDate: startDate,
          endDate: endDate
        },
        withCredentials: true
      }).then(response => response.data.results).catch(error => {
        $log.error('XHR Failed for getDispensation. ' + error.data);
        return $q.reject(error);
      });
    }

  }

  function getDefaultItemQuantityToDispense(item){
    return item.arv ? ((item.drugToPickUp > 30 ) ? 30 : item.drugToPickUp) : item.drugToPickUp; 
  }

})();
