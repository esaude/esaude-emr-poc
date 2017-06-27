(function () {
  'use strict';

  angular
    .module('authentication')
    .factory('authenticator', authenticator);

  authenticator.$inject = ['$rootScope', '$q', 'sessionService'];

  function authenticator($rootScope, $q, sessionService) {
    var service = {
      authenticateUser: authenticateUser
    };
    return service;

    ////////////////

    function authenticateUser() {
      return sessionService.getSession()
        .then(function (session) {
          if (!session.authenticated) {
            return $q.reject();
          }
        })
        .catch(function (error) {
          $rootScope.$broadcast('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
          return $q.reject('LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
        });
    }
  }

})();

