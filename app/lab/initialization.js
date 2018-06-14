(function () {
  'use strict';

  angular
    .module('lab')
    .factory('initialization', initialization);

  /* @ngInject */
  function initialization($cookies, $rootScope, authenticator, appService) {

    return authenticator.authenticateUser()
      .then(initApp);

    ////////////////

    function initApp() {
      return appService.initApp('lab', {'app': true, 'extension': true, 'service': true});
    }
  }

})();
