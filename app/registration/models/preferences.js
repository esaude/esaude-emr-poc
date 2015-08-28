'use strict';

angular.module('registration')
    .factory('Preferences', ['$http', '$rootScope', function() {
      return {
          hasOldIdentifier: false
      };
}]);
