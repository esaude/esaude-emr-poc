(function () {
    'use strict';

    angular
        .module('bahmni.common.appFramework')
        .constant('serializeObject', serializeObject);

    var DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

    function serializeObject(obj) {
        if (obj) {
            //preventing colateral damage, this object could for example 
            //have properties that are binded to fields on the screen
            var copy = angular.copy(obj);

            serialize(copy);
            return copy;
        } else {
            return obj;
        }
    }

    function serialize(obj) {
        if (angular.isObject(obj)) {
            if (angular.isDate(obj)) {
                return moment(obj).format(DATETIME_FORMAT);
            } else if (moment.isMoment(obj)) {
                return obj.format(DATETIME_FORMAT);
            } else {
                angular.forEach(obj, function (value, index) {
                    var formatedValue = serialize(value);
                    if (formatedValue !== null) {
                        obj[index] = formatedValue;
                    }
                });
            }
        }
        return null;
    }

})()
