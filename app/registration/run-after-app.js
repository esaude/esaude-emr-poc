'use strict';

angular
    .module('registration')
    .run(['$rootScope', '$urlRouter', 'appService', 'formStatesAutoGen',
        function($rootScope, $urlRouter, appService, formStatesAutoGen) {
            var $state = $rootScope.$state;
            
            appService.initApp('registration', {'app': true, 'extension' : true }).then(function (data) {
                formStatesAutoGen.gen(data, $state, $stateProviderRef);
            });
            
            $urlRouter.sync();
            $urlRouter.listen();
    }]);
