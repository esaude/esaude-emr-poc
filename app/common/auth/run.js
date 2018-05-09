(function () {
  'use strict';

  angular
    .module('authentication')
    .run(run);

  run.$inject = ['$rootScope', '$window', '$timeout', 'sessionService'];

  function run($rootScope, $window, $timeout, sessionService) {
    var unregister = $rootScope.$on('event:auth-loginRequired', function (ev, message) {
      $timeout(function () {
        sessionService.destroy().then(function () {
          $window.location = "../home/index.html#/login?showLoginMessage=" + message;
        });
      });
    });
    $rootScope.$on('$destroy', unregister);
  }
})();
