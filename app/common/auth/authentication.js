(function () {
  'use strict';

  angular
    .module('authentication')
    .config(config)
    .run(run);

  config.$inject = ['$httpProvider'];

  function config($httpProvider) {
    var interceptor = ['$rootScope', '$q', function ($rootScope, $q) {
      function success(response) {
        return response;
      }

      function error(response) {
        if (response.status === 401 || response.status === 403) {
          $rootScope.$broadcast('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
        }
        return $q.reject(response);
      }

      return {
        response: success,
        responseError: error
      };
    }];
    $httpProvider.interceptors.push(interceptor);
  }

  run.$inject = ['$rootScope', '$window', '$timeout', 'sessionService'];

  function run($rootScope, $window, $timeout, sessionService) {
    $rootScope.$on('event:auth-loginRequired', function () {
      $timeout(function () {
        sessionService.destroy().then(
          function () {
            $window.location = "../home/index.html#/login";
          }
        );
      });
    });
  }

})();
