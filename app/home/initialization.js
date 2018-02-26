(function () {
  'use strict';

  angular
    .module('home')
    .factory('initialization', initialization);

  initialization.$inject = ['spinner', 'appService'];

  /* @ngInject */
  function initialization(spinner, appService) {

    return spinner.forPromise(initApp());

    ////////////////

    function initApp() {
      return appService.initApp('home', {'app': true, 'extension': true, 'service': false})
    }
  }

})();
