(() => {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('drugService', drugService);

  function drugService($http, $q, $log, sessionService) {
    return {
      isArvDrug: isArvDrug,
      isDrugAvailable: isDrugAvailable,
      getDrugsOfRegimen: getDrugsOfRegimen,
      getDrugStock: getDrugStock
    };

    function getDrugsOfRegimen(regime) {
      return $http.get(Bahmni.Common.Constants.drugRegimenUrl, {
        params: {
          regime: regime.uuid
        }
      }).then(response => _.map(response.data.results, 'drugItem.drug')).catch(error => {
        $log.error('XHR Failed for getDrugsOfRegimen: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function isArvDrug(drug) {
      return $http.get(Bahmni.Common.Constants.arvDrugUrl + '/' + drug.uuid)
        .then(response => true)
        .catch(error => {
          $log.error('XHR Failed for isArvDrug: ' + error.data.error.message);
          return $q.reject();
        });
    }


    function getDrugStock(drug, {ignoreLoadingBar = false} = {}) {
      var location = sessionService.getCurrentLocation();
      var config = {
        params: {
          drug: drug.uuid,
          location: location.uuid
        },
        ignoreLoadingBar: ignoreLoadingBar
      };
      return $http.get(Bahmni.Common.Constants.batchUrl, config)
        .then(response => response.data.results)
        .catch(error => {
          $log.error('XHR Failed for getDrugStock: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function isDrugAvailable(drug, options) {
      return getDrugStock(drug, options).then(drugStock => !!drugStock.length);
    }
  }

})();
