'use strict';

angular
    .module('registration')
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
                controller: 'ManageProgramController',
                resolve: { initialization: 'initialization' }
            })
            .state('dashboard.visits', {
                url: '/visits',
                templateUrl: 'views/patient-visits.html',
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
                    'content@detailpatient': { templateUrl: 'views/patient-details.html'}
                },
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.demographic', {
                url: '/demographic',
                templateUrl: 'views/patient-demographics.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.addresses', {
                url: '/addresses',
                templateUrl: 'views/patient-addresses.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.attributes', {
                url: '/attributes',
                templateUrl: 'views/patient-attributes.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.identifiers', {
                url: '/identifiers',
                templateUrl: 'views/patient-identifiers.html',
                resolve: { initialization: 'initialization' }
            })
            .state('detailpatient.death', {
                url: '/death',
                templateUrl: 'views/patient-death.html',
                resolve: { initialization: 'initialization' }
            });
            
            $stateProviderRef = $stateProvider;
            $bahmniTranslateProvider.init({app: 'registration', shouldMerge: true});
    }]);