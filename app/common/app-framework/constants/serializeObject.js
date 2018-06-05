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
            var visitedObjects = [];
            serialize(copy, visitedObjects);
            return copy;
        } else {
            return obj;
        }
    }

    function serialize(obj, visitedObjects) {
        if (angular.isObject(obj) && !isVisited(obj, visitedObjects)) {
            visitedObjects.push(obj);
            if (angular.isDate(obj)) {
                return moment(obj).format(DATETIME_FORMAT);
            } else if (moment.isMoment(obj)) {
                return obj.format(DATETIME_FORMAT);
            } else {
                angular.forEach(obj, function (value, index) {
                    var formatedValue = serialize(value, visitedObjects);
                    if (formatedValue !== null) {
                        obj[index] = formatedValue;
                    }
                });
            }
        }
        return null;
    }

    function isVisited(obj, visitedObjects) {
        var result = visitedObjects.find(function (o) {
            return o === obj;
        });
        return typeof result !== 'undefined';
    }


})();
