(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .component('formWizardPart', {
      controllerAs: 'vm',
      require: {
        formWizard: '^formWizard'
      },
      templateUrl: '../common/clinical-services/components/formWizardPart.html'
    });

})();
