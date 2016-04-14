'use strict';

angular.module('registration')
    .provider('$configInjector', function $configInjectorProvider($stateProvider) {
        
        var http;

        this.init = function(options){
            console.log(http)
            $stateProvider = options;
        };
        this.$get = [function ($http) {
            http = $http;
            return "appService";
        }];
});
