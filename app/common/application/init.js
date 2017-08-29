(function () {
  'use strict';

  angular
    .module('application', [
      'authentication',
      'ncy-angular-breadcrumb'
    ])
    .config(applicationModuleConfig);

  applicationModuleConfig.$inject = ['$provide', '$breadcrumbProvider'];

  /* @ngInject */
  function applicationModuleConfig($provide, $breadcrumbProvider) {
    // $provide.decorator('applicationService', applicationServiceAuthorizationDecorator);

    $breadcrumbProvider.setOptions({
      templateUrl: '/common/application/views/breadcrumb.html'
    });
  }

  applicationServiceAuthorizationDecorator.$inject = ['$delegate', 'authorizationService', '$log'];

  /* @ngInject */
  function applicationServiceAuthorizationDecorator($delegate, authorizationService, $log) {

    $log.info('applicationServiceAuthorizationDecorator: decorating applicationService with authorization.');

    var getApps = $delegate.getApps;

    function getAuthorizedApps() {
      return getApps().then(function (applications) {
        return authorizationService.authorizeApps(applications);
      });
    }

    $delegate.getApps = getAuthorizedApps;
    return $delegate;
  }

})();
