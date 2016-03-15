'use strict';

angular.module('registration')
    .filter('valueofaddress', function() {
          return function(input, scope) {
              input = input || '';
              var value = scope.patient.address[input];

              return value;
          };
    });
