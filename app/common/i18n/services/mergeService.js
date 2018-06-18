(function () {
  'use strict';

  angular
    .module('bahmni.common.i18n')
    .service('mergeService', mergeService);

  function mergeService() {

    return {
      merge: merge,
    };

    function merge(base, custom) {
      // TODO dont use jQuery extend
      var mergeResult = $.extend(true, {}, base, custom);
      return deleteNullValuedKeys(mergeResult);
    }

    function deleteNullValuedKeys (currentObject) {
      _.forOwn(currentObject, (value, key) => {
        if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
          (_.isObject(value) && _.isNull(deleteNullValuedKeys(value)))) {
          delete currentObject[key];
        }
      });
      return currentObject;
    }
  }

})();
