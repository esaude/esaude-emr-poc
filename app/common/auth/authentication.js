'use strict';

angular.module('authentication', []).factory('authenticate',
    ['$q', '$cookieStore', '$state', '$timeout', function ($q, $cookieStore, $state, $timeout) {
        
        return function () {
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
            };
    }]
);
