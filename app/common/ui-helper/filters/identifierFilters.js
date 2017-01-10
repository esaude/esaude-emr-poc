'use strict';

angular.module('bahmni.common.uiHelper')
  .filter('filterNid', function(){
    return function (object) {
      var identifiers = [];
      angular.forEach(object, function (identifier) {
        if (identifier.uuid != 'e2b966d0-1d5f-11e0-b929-000c29ad1d07') {
          identifiers.push(identifier);
        }
      });
      return identifiers;

    };
  });
