(() => {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('drugService', drugService);

  drugService.$inject = ['$http', '$q', '$log'];

  function drugService($http, $q, $log ) {
    return {
      isArvDrug: isArvDrug,
      getDrugsOfRegimen: getDrugsOfRegimen,
      getDrugStock: getDrugStock
    };

  function getDrugsOfRegimen(regime) {
      return $http.get(Bahmni.Common.Constants.drugRegimenUrl, {
        params: {
          regime : regime.uuid
        }
      }).then(response => _.map(response.data.results, 'drugItem.drug')).catch(error => {
        $log.error('XHR Failed for getDrugsOfRegimen: ' + error.data.error.message);
        return $q.reject(error);
    });
  }

  function isArvDrug(drug) {
     return $http.get(Bahmni.Common.Constants.arvDrugUrl +'/'+ drug.uuid)
        .then(response => true)
        .catch(error => {
          $log.error('XHR Failed for isArvDrug: ' + error.data.error.message);
          return $q.reject();
      });
  }


  function getDrugStock(drug, location) {
    return $http.get(Bahmni.Common.Constants.batchUrl, {
      params: {
        drug : drug.uuid,
        location : location.uuid
      }
    }).then(response => response.data).catch(error => {
      $log.error('XHR Failed for getDrugStock: ' + error.data.error.message);
      return $q.reject(error);
  });
}

  }
})();

