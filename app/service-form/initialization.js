'use strict';

angular.module('serviceform')
.factory('initialization', ['$rootScope', '$q', 'appService', 'spinner', 'configurations', 'orderTypeService',
    function ($rootScope, $q, appService, spinner, configurations, orderTypeService) {

        var getConfigs = function () {
            var config = $q.defer();
            var configNames = ['patientConfig'];
            configurations.load(configNames).then(function () {
                $rootScope.patientConfig = configurations.patientConfig();
                config.resolve();
            });
            return config.promise;
        };

        var initApp = function () {
            return appService.initApp('serviceform', {'app': true, 'extension' : true });
        };

        return spinner.forPromise(initApp().then(getConfigs()).then(orderTypeService.loadAll()));
    }
]);