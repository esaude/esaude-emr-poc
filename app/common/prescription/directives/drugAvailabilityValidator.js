(() => {
  'use strict';

  angular
    .module('common.prescription')
    .directive('drugAvailabilityValidator', drugAvailabilityValidator);

  function drugAvailabilityValidator($q, drugService) {

    var directive = {
      require: 'ngModel',
      link: link,
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.drugAvailable = (modelValue) => {
        if (ngModel.$isEmpty(modelValue)) {
          return $q.resolve();
        }
        return drugService.isDrugAvailable(modelValue, {ignoreLoadingBar: true})
          .then(isAvailable => isAvailable ? $q.resolve() : $q.reject());
      };
    }

  }

})();
