(function () {
  'use strict';

  angular
    .module('authentication')
    .factory('sessionService', sessionService);

  sessionService.$inject = ['$rootScope', '$http', '$q', '$cookies', 'userService', 'localStorageService', '$log'];

  function sessionService($rootScope, $http, $q, $cookies, userService, localStorageService, $log) {

    var SESSION_RESOURCE_PATH = '/openmrs/ws/rest/v1/session';

    var service = {
      destroy: destroy,
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
      return $http.get(SESSION_RESOURCE_PATH, {
        headers: {'Authorization': 'Basic ' + window.btoa(username + ':' + password)},
        cache: false
      });
    }

    function hasAnyActiveProvider(providers) {
      return _.filter(providers, function (provider) {
        return (angular.isUndefined(provider.retired) || provider.retired === "false")
      }).length > 0;
    }

    function destroy() {
      return $http.delete(SESSION_RESOURCE_PATH).success(function (data) {
        $cookies.remove(Bahmni.Common.Constants.currentUser, {path: '/'});
        localStorageService.cookie.remove("emr.location");
        $rootScope.currentUser = null;
      });
    }

    function getCurrentProvider() {
      return getCurrentUser()
        .then(function (currentUser) {
          return loadProviders(currentUser)
        })
        .then(function (response) {
          return (response.data.results.length > 0) ? response.data.results[0] : undefined;
        })
        .catch(function (error) {
          $log.error('Could not load current provider: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getCurrentUser() {
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);

      return userService.getUser(currentUser)
        .then(function (response) {
          return response.data.results[0];
        })
        .catch(function (error) {
          $log.error('XHR Failed for getCurrentUser: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function loginUser(username, password, locale) {
      var deferrable = $q.defer();
      createSession(username, password).success(function (data) {
        if (data.authenticated) {
          $cookies.put(Bahmni.Common.Constants.currentUser, username, {path: '/'});
          deferrable.resolve();
        } else {
          deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_FAIL_KEY');
        }
      }).error(function () {
        deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_FAIL_KEY');
      });
      return deferrable.promise;
    }

    function getSession() {
      return $http.get(SESSION_RESOURCE_PATH, {cache: false})
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getSession: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function loadCredentials() {
      var deferrable = $q.defer();
      var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);
      if (!currentUser) {
        this.destroy().then(function () {
          $rootScope.$broadcast('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
          deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_SESSION_USER_KEY')
        });
        return deferrable.promise;
      }
      userService.getUser(currentUser).success(function (data) {
        userService.getProviderForUser(data.results[0].uuid).success(function (providers) {
            if (!_.isEmpty(providers.results) && hasAnyActiveProvider(providers.results)) {
              $rootScope.currentUser = new Bahmni.Auth.User(data.results[0]);
              deferrable.resolve(data.results[0]);
            } else {
              destroy();
              deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NOT_PROVIDER');
            }
          }
        ).error(function () {
          destroy();
          deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_PROVIDER');
        });
      }).error(function () {
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
      return $http.post(SESSION_RESOURCE_PATH, {locale: locale}).then(function (response) {
        return null; // Endpoint Does not return anything
      }).catch(function (error) {
        $log.error('XHR Failed for setLocale: ' + error.data.error.message);
        return $q.reject(error);
      })
    }
  }

})();

