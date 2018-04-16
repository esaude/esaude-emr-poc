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


  SexualPartnersController.$inject = ['$stateParams', 'notifier', 'sexualPartnersService', 'spinner', 'translateFilter', 'visitService'];

  /* @ngInject */
  function SexualPartnersController($stateParams, notifier, sexualPartnersService, spinner, translateFilter, visitService) {

    var vm = this;

    vm.checkedIn = false;
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

      visitService.getTodaysVisit(vm.patient.uuid).then(function (visitToday) {
        vm.checkedIn = visitToday !== null;
      });

      var load = sexualPartnersService.getSexualPartners(vm.patient)
        .then(function (partners) {
          vm.partners = partners;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_ERROR'));
        });

      spinner.forPromise(load);
    }

    function addAnother() {
      vm.add = true;
    }

    function removePartner(partner) {
      var remove = sexualPartnersService.removeSexualPartner(partner)
        .then(function () {
          vm.partners.splice(vm.partners.indexOf(partner),1);
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });

      spinner.forPromise(remove);
    }

    function savePartner(partner) {
      var save = sexualPartnersService.saveSexualPartner(vm.patient, partner)
        .then(function (partner) {
          vm.partners.push(partner);
          vm.newPartner = {};
          vm.add = false;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });

      spinner.forPromise(save);
    }
  }

})();
