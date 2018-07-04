(() => {
  'use strict';

  angular
    .module('authentication')
    .config(config);

  /* @ngInject */
  function config($urlRouterProvider, $stateProvider) {

    $stateProvider
      .state('unauthorized', {
        component: 'unauthorized',
        ncyBreadcrumb: {
          skip: true
        },
      });
  }

})();
