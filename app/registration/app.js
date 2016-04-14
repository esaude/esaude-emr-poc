'use strict';

angular
    .module('registration')
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider) {
        $urlRouterProvider.otherwise('/search');
        $stateProvider
            .state('search', {
                url: '/search',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'SearchController'},
                    'content@search': { templateUrl: 'views/search.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard', {
                url: '/dashboard/:patientUuid',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DashboardController'},
                    'content@dashboard': { templateUrl: 'views/dashboard.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.program', {
                url: '/program',
                templateUrl: 'views/patient-programs.html', 
                controller: 'ManageProgramController'
            })
            .state('dashboard.visits', {
                url: '/visits',
                templateUrl: 'views/patient-visits.html'
            })
            .state('dashboard.services', {
                url: '/services',
                templateUrl: 'views/patient-services.html'
            })
            .state('dashboard.alerts', {
                url: '/alerts',
                templateUrl: 'views/patient-alerts.html'
            })
            .state('serviceslist', {
                url: '/services/:patientUuid',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'ServicesListController'},
                    'content@serviceslist': { templateUrl: 'views/services-list.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('newpatient', {
                url: '/patient/new',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'CreatePatientController'},
                    'content@newpatient': { templateUrl: 'views/patient-add.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('newpatient.name', {
                url: '/name',
                templateUrl: 'views/patient-name-input.html'
            })
            .state('newpatient.gender', {
                url: '/gender',
                templateUrl: 'views/patient-gender-input.html'
            })
            .state('newpatient.age', {
                url: '/age',
                templateUrl: 'views/patient-age-input.html'
            })
            .state('newpatient.address', {
                url: '/address',
                templateUrl: 'views/patient-address-input.html'
            })
            .state('newpatient.other', {
                url: '/other',
                templateUrl: 'views/patient-other-input.html'
            })
            .state('newpatient.identifier', {
                url: '/identifier',
                templateUrl: 'views/patient-identifier-input.html'
            })
            .state('newpatient.death', {
                url: '/death',
                templateUrl: 'views/patient-death-input.html'
            })
            .state('newpatient.confirm', {
                url: '/confirm',
                templateUrl: 'views/patient-confirm-input.html'
            })
            .state('editpatient', {
                url: '/patient/edit/:patientUuid',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'UpdatePatientController'},
                    'content@editpatient': { templateUrl: 'views/patient-add.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('editpatient.name', {
                url: '/name',
                templateUrl: 'views/patient-name-input.html'
            })
            .state('editpatient.gender', {
                url: '/gender',
                templateUrl: 'views/patient-gender-input.html'
            })
            .state('editpatient.age', {
                url: '/age',
                templateUrl: 'views/patient-age-input.html'
            })
            .state('editpatient.address', {
                url: '/address',
                templateUrl: 'views/patient-address-input.html'
            })
            .state('editpatient.other', {
                url: '/other',
                templateUrl: 'views/patient-other-input.html'
            })
            .state('editpatient.identifier', {
                url: '/identifier',
                templateUrl: 'views/patient-identifier-input.html'
            })
            .state('editpatient.death', {
                url: '/death',
                templateUrl: 'views/patient-death-input.html'
            })
            .state('editpatient.confirm', {
                url: '/confirm',
                templateUrl: 'views/patient-confirm-input.html'
            })
            .state('visit', {
                url: '/visit/:patientUuid',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'VisitController'},
                    'content@visit': { templateUrl: 'views/visit.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient', {
                url: '/patient/detail/:patientUuid',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DetailPatientController'},
                    'content@detailpatient': { templateUrl: 'views/patient-details.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.demographic', {
                url: '/demographic',
                templateUrl: 'views/patient-demographics.html'
            })
            .state('detailpatient.addresses', {
                url: '/addresses',
                templateUrl: 'views/patient-addresses.html'
            })
            .state('detailpatient.attributes', {
                url: '/attributes',
                templateUrl: 'views/patient-attributes.html'
            })
            .state('detailpatient.identifiers', {
                url: '/identifiers',
                templateUrl: 'views/patient-identifiers.html'
            })
            .state('detailpatient.death', {
                url: '/death',
                templateUrl: 'views/patient-death.html'
            });
            
            $stateProviderRef = $stateProvider;
            $bahmniTranslateProvider.init({app: 'registration', shouldMerge: true});
    }])
    .run(['$rootScope', '$urlRouter', 'appService',
        function($rootScope, $urlRouter, appService) {
            var $state = $rootScope.$state;
            
            appService.initApp('registration', {'app': true, 'extension' : true }).then(function (data) {
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
                                templateUrl: '../poc-common/form-display/views/form-part-input-template.html'
                            };
                            $stateProviderRef.state(formLayout.sufix + part.sref, innerState);
                        }
                    });
                    //confirm inner state
                    if (!$state.get(formLayout.sufix + ".confirm")) {
                        var confirmState = {
                            url: '/confirm',
                            templateUrl: '../poc-common/form-display/views/form-confirm-template.html'
                        };
                        $stateProviderRef.state(formLayout.sufix + ".confirm", confirmState);
                    }
                });
            });
            $urlRouter.sync();
            $urlRouter.listen();
    }]);