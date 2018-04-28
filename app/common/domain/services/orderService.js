(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('orderService', orderService);

  orderService.$inject = ['$http', '$q', '$log'];

  /* @ngInject */
  function orderService($http, $q, $log) {
    var service = {
      getOrder: getOrder
    };
    return service;

    ////////////////

    function getOrder(uuid) {
      return $http.get('/openmrs/ws/rest/v1/order/' + uuid)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          $log.error('XHR failed for getOrder: ' + error.data.error.message);
          return $q.reject(error);
        });
    }
  }

})();
