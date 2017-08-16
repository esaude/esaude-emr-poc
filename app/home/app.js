'use strict';

angular
    .module('home')
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider', '$httpProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider, $httpProvider) {
        // to prevent the browser from displaying a password pop-up in case of an authentication error
        $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('dashboard');
        });

        $stateProvider
          .state('login', {
            url: '/login?showLoginMessage=LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY',
            views: {
              'layout': {
                templateUrl: '../common/application/views/layout.html',
                controller: 'LoginController',
                controllerAs: 'vm'
              },
              'content@login': {
                templateUrl: 'views/login.html'
              }
            }
          })
            .state('dashboard', {
                url: '/dashboard',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DashboardController'},
                    'content@dashboard': { templateUrl: 'views/dashboard.html'}
                },
                resolve: { initialization: 'initialization' }
            });
            $bahmniTranslateProvider.init({app: 'home', shouldMerge: true});
    }]);
