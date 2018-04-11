(function () {
  'use strict';

  angular
    .module('patient.details')
    .filter('valueofothers', valueofothers);

  function valueofothers(dateFilter) {
    return valueofothersFilter;

    ////////////////

    function valueofothersFilter(input, patient) {
      var attributeName = input.name || '';
      var value = patient[attributeName];

      if (input.format === "org.openmrs.Concept") {
        for (var i in input.answers) {
          var data = input.answers[i];
          if (data.conceptId === value) {
            value = data.description;
            break;
          }
        }
      }

      if (input.format === "org.openmrs.util.AttributableDate") {
        value = dateFilter(value);
      }
      return value;
    }
  }

})();
