(() => {
  'use strict';

  angular
    .module('home')
    .factory('initialization', initialization);

  initialization.$inject = ['appService'];

  /* @ngInject */
  function initialization(appService) {

    return initApp();

    ////////////////

    function initApp() {
      return appService.initApp('home', {'app': true, 'extension': true, 'service': false});
    }
  }

})();
