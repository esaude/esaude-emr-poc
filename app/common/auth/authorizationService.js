(() => {
  'use strict';

  angular
    .module('authentication')
    .factory('authorizationService', authorizationService);

  /* @ngInject */
  function authorizationService(sessionService, $q, $log) {
    var service = {
      authorizeApps: authorizeApps,
      authorizeClinicalServices: authorizeClinicalServices,
      isUserAuthorizedForApp: isUserAuthorizedForApp,
      hasRole: hasRole,
      hasPrivilege: hasPrivilege
    };
    return service;

    ////////////////

    /**
     * Determines if the currently logged user has one of specified roles.
     *
     * @param {Array} roles Role to check.
     * @returns {Promise}
     */
    function hasRole(roles) {
      return sessionService.getSession()
        .then(session => {
          var fromSession = session.user.roles.map(r => r.display);
          return _.intersection(fromSession, roles).length > 0;
        })
        .catch(error => {
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
        .then(session => {
          var found = session.user.privileges.filter(p => p.display === privilege);
          return found.length > 0;
        })
        .catch(error => {
          $log.error('Could not check user privilege: ' + error.data.error.message);
          return $q.reject();
        });
    }

    /**
     * User is authorized to use an app if it has one of the roles defined for app in /common/application/resources/app.json
     * @param {Array} apps
     * @param {String} appId
     * @returns {Promise}
     */
    function isUserAuthorizedForApp(apps, appId) {
      return authorizeApps(apps)
        .then(authorizedApps => authorizedApps.map(a => a.id).includes(appId));
    }

    /**
     * @param {Array} apps
     * @returns {Promise} POC applications logged user has access to.
     */
    function authorizeApps(apps) {
      return sessionService.getSession()
        .then(session => {
          var userRoles = session.user.roles.map(r => r.display);
          return getAuthorizedApps(apps, userRoles);
        })
        .catch(error => {
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
        .then(session => {
          var userPrivileges = session.user.privileges.map(r => r.display);
          return getAuthorizedClinicalServices(clinicalServices, userPrivileges);
        })
        .catch(error => {
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
      return apps.filter(a => {
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

      return clinicalServices.filter(srv => {

        if(!srv.privilege || srv.privilege.length === 0) {
          $log.warn('Clinical service ' + srv.label + ' has no user privilege defined.');
          return true;
        }

        var privileges = prefixes.map(p => p + ' ' + srv.privilege);

        return _.intersection(userPrivileges, privileges).length !== 0;
      });
    }
  }

})();
