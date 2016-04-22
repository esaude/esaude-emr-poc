'use strict';

angular
    .module('home')
    .config(['$urlRouterProvider', '$stateProvider', '$bahmniTranslateProvider',
                function ($urlRouterProvider, $stateProvider, $bahmniTranslateProvider) {
//        $urlRouterProvider.otherwise('/dashboard');
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('dashboard');
        });
        
        $stateProvider
            .state('login', {
                url: '/login?showLoginMessage',
                reloadOnSearch: false,
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'LoginController'},
                    'content@login': { templateUrl: 'views/login.html'}
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                reloadOnSearch: false,
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DashboardController'},
                    'content@dashboard': { templateUrl: 'views/dashboard.html'}
                },
                resolve: { initialization: 'initialization' }
            });
            $bahmniTranslateProvider.init({app: 'home', shouldMerge: true});
    }]);
