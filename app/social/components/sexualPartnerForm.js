(function () {
  'use strict';

  angular
    .module('social')
    .component('sexualPartnerForm', {
      bindings: {
        partner: '<',
        onSubmit: '&'
      },
      controller: SexualPartnerFormController,
      controllerAs: 'vm',
      templateUrl: '../social/components/sexualPartnerForm.html'
    });


  SexualPartnerFormController.$inject = ['sexualPartnersService', 'spinner'];

  /* @ngInject */
  function SexualPartnerFormController(sexualPartnersService, spinner) {

    var vm = this;

    vm.$onInit = $onInit;
    vm.submit = submit;

    ////////////////

    function $onInit() {
      var promise = sexualPartnersService.getFormData()
        .then(function (formData) {
          vm.relationshipToPatient = formData.relationshipToPatient;
          vm.hivStatus = formData.hivStatus;
        });
      spinner.forPromise(promise);
    }

    function submit(form) {
      if (form.$valid) {
        vm.onSubmit({partner: vm.partner});
        form.$submitted = false;
      }
    }

  }

})();
