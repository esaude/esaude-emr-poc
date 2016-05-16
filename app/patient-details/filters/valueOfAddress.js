'use strict';

angular.module('patient.details')
    .filter('valueofaddress', function() {
          return function(input, scope) {
              input = input || '';
              var value = scope.patient.address[input];

              return value;
          };
    });
