'use strict';

angular.module('bahmni.common.appFramework')
    .service('mergeService', [function () {
         this.merge = (base, custom) => {
             var mergeResult = $.extend(true, {}, base, custom);
             return deleteNullValuedKeys(mergeResult);
        };
        var deleteNullValuedKeys = currentObject => {
            _.forOwn(currentObject, (value, key) => {
                if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                    (_.isObject(value) && _.isNull(deleteNullValuedKeys(value)))) {
                    delete currentObject[key];
                }
            });
            return currentObject;
        };
    }]);
