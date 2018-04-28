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
      if (changesObj.patient && changesObj.patient.currentValue.uuid) {
        visitService.getPatientLastVisit(changesObj.patient.currentValue)
          .then(processLastVisit);
      }
    }

    function processLastVisit(lastVisit) {
      if (lastVisit) {
        if (!lastVisit.stopDatetime) {
          vm.lastUnclosedVisit = lastVisit;
        } else if (moment().isBetween(lastVisit.startDatetime, lastVisit.stopDatetime)) {
          vm.todayVisit = lastVisit;
        }
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
