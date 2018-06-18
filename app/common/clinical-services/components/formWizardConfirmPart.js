(() => {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .component('formWizardConfirmPart', {
      controllerAs: 'vm',
      require: {
        formWizard: '^formWizard'
      },
      templateUrl: '../common/clinical-services/components/formWizardConfirmPart.html'
    });

})();
