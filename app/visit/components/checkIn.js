(function () {
  'use strict';

  angular
    .module('visit')
    .component('checkIn', {
      bindings: {
        patient: '<',
        onCheckInChange: '&'
      },
      controller: CheckInController,
      controllerAs: 'vm',
      templateUrl: '../visit/components/checkIn.html'
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
          .then(function (todaysLastVisit) {
            if (todaysLastVisit != null) {
              vm.todayVisit = todaysLastVisit;
              vm.disableCheckin = true;
            }
          });
      }
    }

    function checkIn() {
      visitService.checkInPatient(vm.patient)
        .then(function (visit) {
          vm.todayVisit = visit;
          vm.onCheckInChange();
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function cancelCheckIn() {
      visitService.deleteVisit(vm.todayVisit)
        .then(function () {
          vm.todayVisit = null;
          vm.onCheckInChange();
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

  }

})();
