'use strict';

angular.module('patient.details')
    .filter('valueofaddress', function() {
          return function(input, scope) {
              input = input || '';
            return scope.patient.address[input];
          };
    });
