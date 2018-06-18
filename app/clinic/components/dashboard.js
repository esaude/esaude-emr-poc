(function () {
  'use strict';

  angular
    .module('clinic')
    .component('dashboard', {
      bindings: {
        patient: '<'
      },
      controller: DashboardController,
      controllerAs: 'vm',
      templateUrl: '../clinic/components/dashboard.html'
    });

  /* @ngInject */
  function DashboardController($q, $state, alertService, visitService, authorizationService) {

    var vm = this;

    vm.flags = [];
    vm.todayVisit = null;
    vm.hasLabOrderPrivilege = false;

    vm.$onInit = $onInit;
    vm.reload = reload;

    function $onInit() {
      visitService.getTodaysVisit(vm.patient.uuid).then(visitToday => {
        if (visitToday) {
          vm.hasVisitToday = true;
          vm.todayVisit = visitToday;
        } else {
          vm.hasVisitToday = false;
        }
      });

      alertService.get(vm.patient.uuid).then(response => {
        vm.flags = response.data.flags;
      });

      checkLabOrderPrivilege();
    }

    function reload() {
      $state.reload();
    }

    function checkLabOrderPrivilege() {
      var privilegeCheckPromises = [];
      var privilegesToCheck = ['Write Test Order', 'Read Test Order', 'Edit Test Order'];
      privilegesToCheck.forEach(privilege => {
        privilegeCheckPromises.push(authorizationService.hasPrivilege(privilege));
      });
      $q.all(privilegeCheckPromises).then(privileges => {
        var grantAccess = true;
        privileges.forEach(privilege => {
          if (!privilege) {
            grantAccess = false;
          }
        });
        vm.hasLabOrderPrivilege = grantAccess;
      });
    }
  }

})();

