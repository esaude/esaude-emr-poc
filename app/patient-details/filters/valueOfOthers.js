'use strict';

angular.module('patient.details')
    .filter('valueofothers', function() {
          return function(input, scope) {
              var attrubuteName = input.name || '';
              var value = scope.patient[attrubuteName];

              if (input.format === "org.openmrs.Concept") {
                  for (var i in input.answers) {
                      var data = input.answers[i];
                      if (data.conceptId === value) {
                          value = data.description;
                          break;
                      }
                  }
              }         
              return value;
          };
    });
