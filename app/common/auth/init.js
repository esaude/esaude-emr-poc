'use strict';
var Bahmni = Bahmni || {};
Bahmni.Auth = Bahmni.Auth || {};

angular
  .module('authentication',
    [
      'ui.router',
      'LocalStorageModule',
      'bahmni.common.config',
      'ngCookies'
    ]
  ).config(authModuleConfig);


authModuleConfig.$inject = ['$provide'];

/* @ngInject */
function authModuleConfig($provide) {
  // $provide.decorator('pocAuthorizeDirective', pocAuthorizeDirectiveDecorator)
}

pocAuthorizeDirectiveDecorator.$inject = ['$delegate', 'authorizationService', '$log'];

function pocAuthorizeDirectiveDecorator($delegate, authorizationService, $log) {

  $log.info('pocAuthorizeDirectiveDecorator: decorating pocAuthorizeDirective with authorization.');

  var directive = $delegate[0];

  function link(scope, element, attrs) {
    authorizationService.hasPrivilege(scope.privilege).then(function (hasPrivilege) {
      scope.authorized = hasPrivilege;
    });
  }

  directive.compile = function () {
    return function (scope, element, attrs) {
      link.apply(this, arguments);
    }
  };

  delete directive.link;
  return $delegate;
}
