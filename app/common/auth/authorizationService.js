(function () {
  'use strict';

  angular
    .module('authentication')
    .factory('authorizationService', authorizationService);

  authorizationService.$inject = ['sessionService', '$q', '$log'];

  function authorizationService(sessionService, $q, $log) {
    var service = {
      hasRole: hasRole,
      hasPrivilege: hasPrivilege
    };
    return service;

    ////////////////

    /**
     * Determines if the currently logged user has a specific role.
     *
     * @param {String} role Role to check.
     * @returns {Promise}
     */
    function hasRole(role) {
      return sessionService.getSession()
        .then(function (session) {
          var found = session.user.roles.filter(function (r) {
            return r.display === role;
          });
          return found.length > 0;
        })
        .catch(function (error) {
          $log.error('Could not check user role. ' + error);
          return $q.reject();
        });
    }

    /**
     * Determines if the currently logged user has a specific privilege.
     *
     * @param {String} privilege
     * @returns {Promise}
     */
    function hasPrivilege(privilege) {
      return sessionService.getSession()
        .then(function (session) {
          var found = session.user.privileges.filter(function (p) {
            return p.display === privilege;
          });
          return found.length > 0;
        })
        .catch(function (error) {
          $log.error('Could not check user privilege. ' + error);
          return $q.reject();
        });
    }
  }

})();

