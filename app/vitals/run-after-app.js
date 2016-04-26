'use strict';

angular
    .module('vitals')
    .run(['$rootScope', '$urlRouter', 'appService',
        function($rootScope, $urlRouter, appService) {
            var $state = $rootScope.$state;
            
            appService.initApp('vitals', {'app': true, 'extension' : true }).then(function (data) {
                _.forEach(data.getClinicalServices(), function (service) {
                    var formLayout = _.find(data.getFormLayout(), function (layout) {
                        return service.formId === layout.formId;
                    });
                    //create main state
                    if (!$state.get(formLayout.sufix)) {
                        var state = {
                            url: service.url + "/:patientUuid/:formUuid",
                            views: {},
                            resolve: { initialization: 'initialization' }
                        };
                        state.views["layout"] = {
                            templateUrl: '../common/application/views/layout.html', 
                            controller: 'FormController'
                        },
                        state.views["content@" + formLayout.sufix] = {templateUrl: '../service-form/views/form-add.html'};
                        $stateProviderRef.state(formLayout.sufix, state);
                    }
                    //create inner states
                    _.forEach(formLayout.parts, function (part) {
                        if (!$state.get(formLayout.sufix + part.sref)) {
                            var innerState = {
                                url: part.sref.replace('.','/'),
                                templateUrl: '../poc-common/form-display/views/form-part-input-template.html',
                                resolve: { initialization: 'initialization' }
                            };
                            $stateProviderRef.state(formLayout.sufix + part.sref, innerState);
                        }
                    });
                    //confirm inner state
                    if (!$state.get(formLayout.sufix + ".confirm")) {
                        var confirmState = {
                            url: '/confirm',
                            templateUrl: '../poc-common/form-display/views/form-confirm-template.html',
                            resolve: { initialization: 'initialization' }
                        };
                        $stateProviderRef.state(formLayout.sufix + ".confirm", confirmState);
                    }
                });
            });
            $urlRouter.sync();
            $urlRouter.listen();
    }]);
