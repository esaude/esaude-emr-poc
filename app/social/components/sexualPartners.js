(function () {
  'use strict';

  angular
    .module('social')
    .component('sexualPartners', {
      bindings: {
        patient: '<'
      },
      controller: SexualPartnersController,
      controllerAs: 'vm',
      templateUrl: '../social/components/sexualPartners.html'
    });


  SexualPartnersController.$inject = ['$stateParams', 'notifier', 'sexualPartnersService',  'translateFilter'];

  /* @ngInject */
  function SexualPartnersController($stateParams, notifier, sexualPartnersService,  translateFilter) {

    var vm = this;

    vm.partners = [];
    vm.newPartner = {
      relationship: null,
      hivStatus: null
    };

    vm.$onInit = $onInit;
    vm.addAnother = addAnother;
    vm.removePartner = removePartner;
    vm.savePartner = savePartner;

    ////////////////


    function $onInit() {
      sexualPartnersService.getSexualPartners(vm.patient)
        .then(partners => {
          vm.partners = partners;
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_ERROR'));
        });
    }

    function addAnother() {
      vm.add = true;
    }

    function removePartner(partner) {
      sexualPartnersService.removeSexualPartner(partner)
        .then(() => {
          vm.partners.splice(vm.partners.indexOf(partner),1);
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function savePartner(partner) {
      sexualPartnersService.saveSexualPartner(vm.patient, partner)
        .then(partner => {
          vm.partners.push(partner);
          vm.newPartner = {};
          vm.add = false;
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }
  }

})();
