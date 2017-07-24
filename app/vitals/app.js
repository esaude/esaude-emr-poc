'use strict';

angular
    .module('vitals')
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {
        // to prevent the browser from displaying a password pop-up in case of an authentication error
        $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
        $urlRouterProvider.otherwise(function ($injector) {
            var localStorageService = $injector.get('localStorageService');
            var movingPatient = localStorageService.get('movingPatient');
            var $state = $injector.get('$state');

            if (movingPatient !== null) {
                $state.go('mvp');
            } else {
                $state.go('search');
            }
        });

        $stateProvider
            .state('mvp', {
                views: {
                    'layout': { template: '<div id="overlay"><div></div></div>', controller: 'MovePatientController'}
                },
                resolve: { initialization: 'initialization' }
            })
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
            .state('detailpatient', {
              url: '/patient/detail/:patientUuid',
              views: {
                'layout': {
                  templateUrl: '../common/application/views/layout.html',
                  controller: 'DetailPatientController',
                  controllerAs: 'patientCommon'
                },
                'content@detailpatient': {templateUrl: '../patient-details/views/patient-details.html'}
              },
              resolve: {initialization: 'initialization'}
            });

            $stateProviderRef = $stateProvider;
            $bahmniTranslateProvider.init({app: 'vitals', shouldMerge: true});
    }]);
