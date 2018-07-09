(() => {
  'use strict';

  angular
    .module('authentication')
    .run(authenticationHandler);

  /* @ngInject */
  function authenticationHandler($rootScope, $window, $timeout, sessionService) {
    // Redirect to login if not authenticated
    const unregister = $rootScope.$on('event:auth-loginRequired', () => {
      $timeout(() => {
        sessionService.destroy().then(() => {
          $window.location = "../home/index.html#/login";
        });
      });
    });
    $rootScope.$on('$destroy', unregister);
  }

})();
