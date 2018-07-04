(function () {
  'use strict';

  angular
    .module('authentication')
    .config(config);

  config.$inject = ['$provide', '$httpProvider'];

  function config($provide, $httpProvider) {
    interceptor($httpProvider);
    decorator($provide);
  }

  /**
   * Registers an interceptor that broadcasts an event informing that login is required on every 401 Unauthorized or
   * 403 Forbidden response.
   *
   * See this modules run block for event handling.
   *
   * @param $httpProvider
   */
  function interceptor($httpProvider) {
    var interceptor = ['$rootScope', '$q', ($rootScope, $q) => {
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

  function decorator($provide) {
    $provide.decorator('pocAuthorizeDirective', pocAuthorizeDirectiveDecorator);
  }

  pocAuthorizeDirectiveDecorator.$inject = ['$delegate', 'authorizationService', '$log'];

  function pocAuthorizeDirectiveDecorator($delegate, authorizationService, $log) {

    $log.info('pocAuthorizeDirectiveDecorator: decorating pocAuthorizeDirective with authorization.');

    var directive = $delegate[0];

    function link(scope, element, attrs) {
      authorizationService.hasPrivilege(scope.privilege).then(hasPrivilege => {
        scope.authorized = hasPrivilege;
      });
    }

    directive.compile = function () {
      return function (scope, element, attrs) {
        link.apply(this, arguments);
      };
    };

    delete directive.link;
    return $delegate;
  }

})();
