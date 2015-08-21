'use strict';

angular
    .module('home', ['ngRoute', 'ngCookies', 'ui.router', 'application', 'chart.js', 'uiHelper', 'authentication'])
    .config(['$urlRouterProvider', '$stateProvider', '$httpProvider', 
                function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login?showLoginMessage',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'LoginController'},
                    'content@login': { templateUrl: 'views/login.html'}
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                views: {
                    'layout': { templateUrl: '../common/application/views/layout.html', controller: 'DashboardController'},
                    'content@dashboard': { templateUrl: 'views/dashboard.html'}
                },
                resolve: {authenticate: authenticate}
            });
            function authenticate($q, $cookieStore, $state, $timeout) {
                console.log($cookieStore.get('user'));
                if ($cookieStore.get('user') != null) {
                    debugger;
                    // Resolve the promise successfully
                    return $q.when();
                } else {
                    debugger;
                    // The next bit of code is asynchronously tricky.

                    $timeout(function () {
                        // This code runs after the authentication promise has been rejected.
                        // Go to the log-in page
                        $state.go('login', { showLoginMessage: true});
                    });

                    // Reject the authentication promise to prevent the state from loading
                    return $q.reject();
                }
            }
            
    }]);
