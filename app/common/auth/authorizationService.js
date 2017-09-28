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
      authorizeApps: authorizeApps,
      authorizeClinicalServices: authorizeClinicalServices
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
          $log.error('Could not check user role: ' + error.data.error.message);
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
          $log.error('Could not check user privilege: ' + error.data.error.message);
          return $q.reject();
        });
    }

    /**
     * @param {Array} apps
     * @returns {Promise} POC applications logged user has access to.
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
          $log.error('Could not authorize apps: ' + error.data.error.message);
          return $q.reject();
        });
    }

    /**
     * @param {Array} clinicalServices
     * @returns {Promise} Clinical services for which the user has at least one of Read/Write/Edit/Delete privileges.
     */
    function authorizeClinicalServices(clinicalServices) {
      return sessionService.getSession()
        .then(function (session) {
          var userPrivileges = session.user.privileges.map(function (r) {
            return r.display;
          });
          return getAuthorizedClinicalServices(clinicalServices, userPrivileges);
        })
        .catch(function (error) {
          $log.error('Could not authorize clinical services: ' + error.data.error.message);
          return $q.reject();
        });
    }

    /**
     * @param {Array} apps
     * @param {Array} userRoles
     * @returns {Array} apps with roles contained in userRoles.
     */
    function getAuthorizedApps(apps, userRoles) {
      return apps.filter(function (a) {
        if (!a.roles || a.roles.length === 0) {
          $log.warn('App ' + a.name + ' has no user roles defined.');
          return true;
        }
        return _.intersection(userRoles, a.roles).length !== 0;
      });
    }

    /**
     * @param {Array} clinicalServices
     * @param {Array} userPrivileges
     * @returns {Array} clinicalServices with at least one privilege contained in userPrivileges.
     */
    function getAuthorizedClinicalServices(clinicalServices, userPrivileges) {

      var prefixes = ['Read', 'Write', 'Edit', 'Delete'];

      return clinicalServices.filter(function (srv) {

        if(!srv.privilege || srv.privilege.length === 0) {
          $log.warn('Clinical service ' + srv.label + ' has no user privilege defined.');
          return true;
        }

        var privileges = prefixes.map(function (p) {
          return p + ' ' + srv.privilege;
        });

        return _.intersection(userPrivileges, privileges).length !== 0;
      });
    }
  }

})();
