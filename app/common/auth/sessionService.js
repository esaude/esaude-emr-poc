(function () {
  'use strict';

  angular
    .module('authentication')
    .factory('sessionService', sessionService);

  sessionService.$inject = ['$cookies', '$http', '$log', '$q', '$rootScope', 'localStorageService', 'locationService',
    'userService'];

  function sessionService($cookies, $http, $log, $q, $rootScope, localStorageService, locationService, userService) {

    var SESSION_RESOURCE_PATH = '/openmrs/ws/rest/v1/session';

    var CURRENT_LOCATION_KEY = 'emr.location';

    var service = {
      destroy: destroy,
      getCurrentLocation: getCurrentLocation,
      getCurrentProvider: getCurrentProvider,
      getCurrentUser: getCurrentUser,
      getSession: getSession,
      loadCredentials: loadCredentials,
      loadProviders: loadProviders,
      loginUser: loginUser,
      setLocale: setLocale
    };
    return service;

    ////////////////

    function createSession(username, password) {
      var config = {
        headers: {'Authorization': 'Basic ' + window.btoa(username + ':' + password)},
        cache: false
      };
      return $http.get(SESSION_RESOURCE_PATH, config)
        .then(response => response.data.authenticated)
        .catch(error => {
          $log.error('XHR failed for createSession: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function hasAnyActiveProvider(providers) {
      return _.filter(providers, provider => (angular.isUndefined(provider.retired) || provider.retired === "false")).length > 0;
    }

    function destroy() {
      return $http.delete(SESSION_RESOURCE_PATH)
        .then(() => {
          $cookies.remove(Bahmni.Common.Constants.currentUser, {path: '/'});
          localStorageService.cookie.remove("emr.location");
          $rootScope.currentUser = null;
          $rootScope.$broadcast('event:auth-logout');
        });
    }

    function getCurrentProvider() {
      return getCurrentUser()
        .then(currentUser => loadProviders(currentUser))
        .then(response => (response.data.results.length > 0) ? response.data.results[0] : undefined)
        .catch(error => {
          $log.error('Could not load current provider: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getCurrentUser() {
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);

      if (!currentUser) {
       return $q.resolve(null);
      }

      return userService.getUser(currentUser)
        .then(response => response.data.results[0])
        .catch(error => {
          $log.error('XHR Failed for getCurrentUser: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function loginUser(username, password) {
      var authenticated = false;
      return createSession(username, password)
        .then(auth => {
          authenticated = auth;
          if (authenticated) {
            $cookies.put(Bahmni.Common.Constants.currentUser, username, {path: '/'});
          } else {
            return $q.reject('LOGIN_LABEL_LOGIN_ERROR_FAIL_KEY');
          }
        })
        .then(() => loadCredentials())
        .then(() => loadDefaultLocation())
        .then(() => {
          $rootScope.$broadcast('event:auth-login');
        })
        .catch(error => {
          $log.error('XHR Failed for loginUser: ' + (error.data && error.data.error.message || error));
          return $q.reject(error.data ? 'LOGIN_LABEL_LOGIN_ERROR_FAIL_KEY' : error);
        });
    }

    function getSession() {
      return $http.get(SESSION_RESOURCE_PATH, {cache: false})
        .then(response => response.data)
        .catch(error => {
          $log.error('XHR Failed for getSession: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function loadCredentials() {
      var deferrable = $q.defer();
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);
      if (!currentUser) {
        this.destroy().then(() => {
          $rootScope.$broadcast('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
          deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_SESSION_USER_KEY');
        });
        return deferrable.promise;
      }
      userService.getUser(currentUser).success(data => {
        userService.getProviderForUser(data.results[0].uuid).success(providers => {
            if (!_.isEmpty(providers.results) && hasAnyActiveProvider(providers.results)) {
              $rootScope.currentUser = new Bahmni.Auth.User(data.results[0]);
              deferrable.resolve(data.results[0]);
            } else {
              destroy();
              deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NOT_PROVIDER');
            }
          }
        ).error(() => {
          destroy();
          deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_PROVIDER');
        });
      }).error(() => {
        destroy();
        deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_ROLES');
      });
      return deferrable.promise;
    }

    function loadProviders(userInfo) {
      return $http.get(Bahmni.Common.Constants.providerUrl, {
        method: "GET",
        params: {
          user: userInfo.uuid
        },
        cache: false
      });
    }

    function setLocale(locale) {
      return $http.post(SESSION_RESOURCE_PATH, {locale: locale}).then(() => {
        return null; // Endpoint Does not return anything
      }).catch(error => {
        $log.error('XHR Failed for setLocale: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function getCurrentLocation() {
      return localStorageService.cookie.get(CURRENT_LOCATION_KEY);
    }

    function loadDefaultLocation() {
      return locationService.getDefaultLocation()
        .then(location => {
          localStorageService.cookie.remove(CURRENT_LOCATION_KEY);
          location = {name: location.display, uuid: location.uuid, code: location.code};
          localStorageService.cookie.set(CURRENT_LOCATION_KEY, location, 7);
        }).catch(error => {
          $rootScope.$broadcast('event:auth-loginRequired', error.data ? error.data.error.message : error);
          return $q.reject(error);
        });
    }
  }

})();

