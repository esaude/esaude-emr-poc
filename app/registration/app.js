'use strict';

angular
    .module('registration')
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {
        // to prevent the browser from displaying a password pop-up in case of an authentication error
        $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('search');
        });

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
                templateUrl: '../common/uicontrols/programmanagement/views/patient-programs.html',
                controller: 'ManageProgramController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.visits', {
                url: '/visits',
                templateUrl: 'views/patient-visits.html',
                controller: 'VisitController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.services', {
                url: '/services',
                templateUrl: 'views/patient-services.html',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.alerts', {
                url: '/alerts',
                templateUrl: 'views/patient-alerts.html',
                resolve: { initialization: 'initialization' }
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
                templateUrl: 'views/patient-name-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('newpatient.gender', {
                url: '/gender',
                templateUrl: 'views/patient-gender-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('newpatient.age', {
                url: '/age',
                templateUrl: 'views/patient-age-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('newpatient.address', {
                url: '/address',
                templateUrl: 'views/patient-address-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('newpatient.other', {
                url: '/other',
                templateUrl: 'views/patient-other-input.html'
            })
            .state('newpatient.identifier', {
                url: '/identifier',
                templateUrl: 'views/patient-identifier-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('newpatient.death', {
                url: '/death',
                templateUrl: 'views/patient-death-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('newpatient.confirm', {
                url: '/confirm',
                templateUrl: 'views/patient-confirm-input.html',
                resolve: { initialization: 'initialization' }
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
                templateUrl: 'views/patient-name-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('editpatient.gender', {
                url: '/gender',
                templateUrl: 'views/patient-gender-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('editpatient.age', {
                url: '/age',
                templateUrl: 'views/patient-age-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('editpatient.address', {
                url: '/address',
                templateUrl: 'views/patient-address-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('editpatient.other', {
                url: '/other',
                templateUrl: 'views/patient-other-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('editpatient.identifier', {
                url: '/identifier',
                templateUrl: 'views/patient-identifier-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('editpatient.death', {
                url: '/death',
                templateUrl: 'views/patient-death-input.html',
                resolve: { initialization: 'initialization' }
            })
            .state('editpatient.confirm', {
                url: '/confirm',
                templateUrl: 'views/patient-confirm-input.html',
                resolve: { initialization: 'initialization' }
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
                    'content@detailpatient': { templateUrl: '../patient-details/views/patient-details.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.demographic', {
                url: '/demographic',
                templateUrl: '../patient-details/views/patient-demographics.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.addresses', {
                url: '/addresses',
                templateUrl: '../patient-details/views/patient-addresses.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.attributes', {
                url: '/attributes',
                templateUrl: '../patient-details/views/patient-attributes.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.identifiers', {
                url: '/identifiers',
                templateUrl: '../patient-details/views/patient-identifiers.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.death', {
                url: '/death',
                templateUrl: '../patient-details/views/patient-death.html',
                resolve: { initialization: 'initialization' }
            });

            $stateProviderRef = $stateProvider;
            $bahmniTranslateProvider.init({app: 'registration', shouldMerge: true});
    }]);
