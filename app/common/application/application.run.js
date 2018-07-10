(() => {
  'use strict';

  angular
    .module('application')
    .run(barcodeScanner)
    .run(routeAuthorizationHandler);

  /* @ngInject */
  function barcodeScanner($document) {
    // Prevents CTRL + j from barcode scanner
    $document.keydown(event => {
      if (event.keyCode === 74 && event.ctrlKey) {
        event.preventDefault();
      }
    });
  }

  /* @ngInject */
  function routeAuthorizationHandler($q, $transitions, applicationService, authorizationService) {
    // Hook into transitions to states requiring authorization
    const criteriaObj = {
      to: (state) => state.data && !!state.data.authorization
    };
    $transitions.onBefore(criteriaObj, (transition) => {
      const appId = transition.to().data.authorization;
      return applicationService.getApps()
        .then(apps => authorizationService.isUserAuthorizedForApp(apps, appId))
        .then(isAuthorized => {
          if (!isAuthorized) {
            return transition.router.stateService.target('unauthorized');
          }
        });
    });
  }

})();
