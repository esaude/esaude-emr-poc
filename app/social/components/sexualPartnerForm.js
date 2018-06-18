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


  SexualPartnerFormController.$inject = ['sexualPartnersService'];

  /* @ngInject */
  function SexualPartnerFormController(sexualPartnersService) {

    var vm = this;

    vm.$onInit = $onInit;
    vm.submit = submit;

    ////////////////

    function $onInit() {
      sexualPartnersService.getFormData()
        .then(formData => {
          vm.relationshipToPatient = formData.relationshipToPatient;
          vm.hivStatus = formData.hivStatus;
        });
    }

    function submit(form) {
      if (form.$valid) {
        vm.onSubmit({partner: vm.partner});
        form.$submitted = false;
      }
    }

  }

})();
