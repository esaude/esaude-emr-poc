(() => {
  'use strict';

  angular
    .module('registration')
    .factory('initialization', initialization);

  /* @ngInject */
  function initialization(appService) {
      return appService.initApp('registration', {'app': true, 'extension': true, 'service': true});
  }

})();
