(function () {
  'use strict';

  angular
    .module('visit')
    .component('checkIn', {
      bindings: {
        patient: '<',
        onCheckIn: '&'
      },
      controller: CheckInController,
      controllerAs: 'vm',
      templateUrl: '../visit/components/checkIn.html'
    });

  CheckInController.$inject = ['sessionService', 'translateFilter', 'visitService', 'notifier', 'spinner'];

  /* @ngInject */
  function CheckInController(sessionService, translateFilter, visitService, notifier, spinner) {

    var vm = this;

    vm.$onChanges = $onChanges;
    vm.checkIn = checkIn;

    function $onChanges(changesObj) {
      if (changesObj.patient && changesObj.patient.currentValue.uuid) {
        var promise = visitService.getPatientLastVisit(changesObj.patient.currentValue)
          .then(processLastVisit);

        spinner.forPromise(promise);
      }
    }

    function processLastVisit(lastVisit) {
      if (lastVisit) {
        if (!lastVisit.stopDatetime) {
          vm.lastUnclosedVisit = lastVisit;
          vm.disableCheckin = true;
        } else if (moment().isBetween(lastVisit.startDatetime, lastVisit.stopDatetime)) {
          vm.todayVisit = lastVisit;
          vm.disableCheckin = true;
        }
      }
    }

    function checkIn() {
      var promise = visitService.checkInPatient(vm.patient)
        .then(function (visit) {
          vm.todayVisit = visit;
          vm.disableCheckin = true;
          vm.onCheckIn();
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });

      spinner.forPromise(promise);
    }

  }

})();
