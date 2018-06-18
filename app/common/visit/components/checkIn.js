(function () {
  'use strict';

  angular
    .module('poc.common.visit')
    .component('checkIn', {
      bindings: {
        patient: '<',
        onCheckInChange: '&'
      },
      controller: CheckInController,
      controllerAs: 'vm',
      templateUrl: '../common/visit/components/checkIn.html'
    });

  CheckInController.$inject = ['sessionService', 'translateFilter', 'visitService', 'notifier'];

  /* @ngInject */
  function CheckInController(sessionService, translateFilter, visitService, notifier) {

    var vm = this;

    vm.$onChanges = $onChanges;
    vm.checkIn = checkIn;
    vm.cancelCheckIn = cancelCheckIn;

    function $onChanges(changesObj) {
      var patient = changesObj.patient.currentValue;
      if (patient && patient.uuid) {
        visitService.getTodaysVisit(patient.uuid)
          .then(todaysLastVisit => {
            if (todaysLastVisit != null) {
              vm.todayVisit = todaysLastVisit;
            }
          });
      }
    }

    function checkIn() {
      visitService.checkInPatient(vm.patient)
        .then(visit => {
          vm.todayVisit = visit;
          vm.onCheckInChange();
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function cancelCheckIn() {
      visitService.deleteVisit(vm.todayVisit)
        .then(() => {
          vm.todayVisit = null;
          vm.onCheckInChange();
        })
        .catch(errorMsg => {
          notifier.error(errorMsg);
        });
    }

  }

})();
