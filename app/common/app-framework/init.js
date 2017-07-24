var Bahmni = Bahmni || {};
Bahmni.Common = Bahmni.Common || {};
Bahmni.Common.AppFramework = Bahmni.Common.AppFramework || {};

angular
  .module('bahmni.common.appFramework',
    [
      'authentication'
    ]
  )
  .config(appFrameworkModuleConfig);


appFrameworkModuleConfig.$inject = ['$provide'];

/* @ngInject */
function appFrameworkModuleConfig($provide) {
  // $provide.decorator('appService', appServiceAuthorizationDecorator);
}

appServiceAuthorizationDecorator.$inject = ['$delegate', 'authorizationService', '$log'];

/* @ngInject */
function appServiceAuthorizationDecorator($delegate, authorizationService, $log) {

  $log.info('appServiceAuthorizationDecorator: decorating appService with authorization.');

  var loadClinicalServices = $delegate.loadClinicalServices;

  function loadAuthorizedClinicalServices(appDescriptor) {
    return loadClinicalServices(appDescriptor).then(function (appDescriptor) {
      authorizationService.authorizeClinicalServices(appDescriptor.getClinicalServices())
        .then(function (authClinicalServices) {
          appDescriptor.setClinicalServices(authClinicalServices);
        });
    });
  }

  $delegate.loadClinicalServices = loadAuthorizedClinicalServices;
  return $delegate;
}
