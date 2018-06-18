(() => {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .config(config);

  config.$inject = ['$provide'];

  function config($provide) {
    // Will be used when authorization is fully implemented
    // $provide.decorator('clinicalServicesService', clinicalServicesServiceAuthorizationDecorator);
  }

  clinicalServicesServiceAuthorizationDecorator.$inject = ['$delegate', 'authorizationService', '$log'];

  function clinicalServicesServiceAuthorizationDecorator($delegate, authorizationService, $log) {
    $log.info('appServiceAuthorizationDecorator: decorating clinicalServicesService with authorization.');

    var loadClinicalServices = $delegate.loadClinicalServices;

    function loadAuthorizedClinicalServices() {
      return loadClinicalServices().then(authorizationService.authorizeClinicalServices);
    }

    $delegate.loadClinicalServices = loadAuthorizedClinicalServices;
    return $delegate;
  }

})();
