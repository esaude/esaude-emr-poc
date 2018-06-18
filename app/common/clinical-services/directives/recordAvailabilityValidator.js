// TODO: only used in registration
(() => {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .directive('recordAvailabilityValidator', recordAvailabilityValidator);

  /* @ngInject */
  function recordAvailabilityValidator($http) {

    var directive = {
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      var url = attrs.recordAvailabilityValidator;

      function setAsAvailable(bool) {
        ngModel.$setValidity('available', bool);
      }

      ngModel.$parsers.push(value => {
        if (!value || value.length === 0)
          return;

        setAsAvailable(false);

        $http.get('/openmrs' + url, {params:{q: value}})
          .success(data => {
            if (!_.isEmpty(data.results)) {
              setAsAvailable(false);
            } else {
              setAsAvailable(true);
            }
          });

        return value;
      });
    }

  }

})();
