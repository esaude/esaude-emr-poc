(() => {
  'use strict';

  angular
    .module('common.patient')
    .factory('addressAttributeService', addressAttributeService);

  /* @ngInject */
  function addressAttributeService($http, $log, $q) {

    return {
      search: search,
    };

    function search(fieldName, query, parentField, parentName) {
      var url = "/openmrs/module/addresshierarchy/ajax/getPossibleAddressHierarchyEntriesWithParents.form";

      var options = {
        params: {
          searchString: query,
          addressField: fieldName,
          parentField: parentField,
          parentName: parentName,
          limit: 20
        },
      };

      return $http.get(url, options)
        .then(response => response.data)
        .catch(error => {
          $log.error('XHR Failed for search: ' + error.data.error.message);
          return $q.reject(error);
        });
    }
  }

})();
