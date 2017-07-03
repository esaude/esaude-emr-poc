(function () {
  'use strict';

  angular
    .module('authentication')
    .factory('authorizationService', authorizationService);

  authorizationService.$inject = ['sessionService', '$q', '$log'];

  function authorizationService(sessionService, $q, $log) {
    var service = {
      hasRole: hasRole,
      hasPrivilege: hasPrivilege,
      authorizeApps: authorizeApps
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

    /**
     * @param {Array} apps
     * @returns {Array} POC applications logged user has access to.
     */
    function authorizeApps(apps) {
      return sessionService.getSession()
        .then(function (session) {
          var userRoles = session.user.roles.map(function (r) {
            return r.display;
          });
          return getAuthorizedApps(apps, userRoles);
        })
        .catch(function (error) {
          $log.error('Could not authorize apps. ' + error);
          return $q.reject();
        });
    }

    /**
     * Filters apps with roles contained in userRoles.
     *
     * @param {Array} apps
     * @param {Array} userRoles
     */
    function getAuthorizedApps(apps, userRoles) {
      return apps.filter(function (a) {
        if (!a.roles || a.roles.length === 0) {
          $log.info('App ' + a.name + ' has no user roles defined.');
          return true;
        }
        return _.intersection(userRoles, a.roles).length !== 0;
      });
    }
  }

})();
