'use strict';

angular.module('bahmni.common.uiHelper')
  .filter('filterNid', () => object => {
    var identifiers = [];
    angular.forEach(object, identifier => {
      if (identifier.uuid != 'e2b966d0-1d5f-11e0-b929-000c29ad1d07') {
        identifiers.push(identifier);
      }
    });
    return identifiers;

  });
