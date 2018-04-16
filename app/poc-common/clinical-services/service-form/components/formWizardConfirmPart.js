(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.serviceform')
    .component('formWizardConfirmPart', {
      controllerAs: 'vm',
      require: {
        formWizard: '^formWizard'
      },
      templateUrl: '../poc-common/clinical-services/service-form/components/formWizardConfirmPart.html'
    });

})();
