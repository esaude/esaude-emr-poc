(function () {
  'use strict';

  angular
    .module('bahmni.common.i18n')
    .service('mergeLocaleFilesService', mergeLocaleFilesService);

  function mergeLocaleFilesService($http, $q, $log, mergeService) {

    return function (options) {

      var baseLocaleUrl = '/poc_config/openmrs/i18n/common/';
      var customLocaleUrl = '/poc_config/openmrs/i18n/';
      var fileURL = options.app + "/locale_" + options.key + ".json";
      var baseResponse = {};

      function loadFile(url) {
        return $http.get(url, {withCredentials: true});
      }

      return loadFile(baseLocaleUrl + "locale_" + options.key + ".json")
        .then(response => {
          baseResponse = response;
          return loadFile(customLocaleUrl + fileURL);
        })
        .then(customResponse => {
          if (options.shouldMerge || angular.isUndefined(options.shouldMerge)) {
            return mergeService.merge(baseResponse.data, customResponse.data);
          }
          return [baseResponse.data, customResponse.data];
        })
        .catch(error => {
          $log.error('XHR Failed for mergeLocaleFile: ' + error);
          return $q.reject(options.key);
        });

    };
  }

})();

