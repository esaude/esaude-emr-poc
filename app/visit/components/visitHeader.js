(function () {
  'use strict';

  angular
    .module('visit')
    .component('visitHeader', {
      bindings: {
        patient: '<'
      },
      controller: VisitController,
      controllerAs: 'vm',
      templateUrl: '../visit/components/visitHeader.html'
    });

  VisitController.$inject = ['$rootScope', '$filter', 'visitService', 'notifier'];

  /* @ngInject */
  function VisitController($rootScope, $filter, visitService, notifier) {

    var DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

    var dateFilter = $filter('date');
    var translateFilter = $filter('translate');

    var vm = this;

    vm.disableCheckin = false;
    vm.lastConsultationMessage = translateFilter('COMMON_NONE');
    vm.lastPharmacyMessage = translateFilter('COMMON_NONE');
    vm.lastUnclosedVisit = null;
    vm.lastVisitMessage = translateFilter('COMMON_NONE');
    vm.loadFailed = false;
    vm.nextConsultationMessage = translateFilter('COMMON_NOT_SCHEDULED');
    vm.nextPharmacyMessage = translateFilter('COMMON_NOT_SCHEDULED');
    vm.todayVisit = null;

    vm.$onChanges = $onChanges;
    vm.isInThePast = isInThePast;
    vm.loadVisitHeader = loadVisitHeader;

    ////////////////

    function $onChanges(changesObj) {
      if (changesObj.patient && changesObj.patient.currentValue.age) {
        var patient = changesObj.patient.currentValue;
        loadVisitHeader(patient);
      }
    }

    function isInThePast(date) {
      return moment().isAfter(date);
    }

    function loadVisitHeader(patient) {
      visitService.getVisitHeader(patient)
        .then(function (visitHeader) {
          vm.loadFailed = false;
          _.assign(vm, visitHeader);
          updateConsultationMessages();
          updatePharmacyMessages();
          updateLastVisitMessage();
        })
        .catch(function (error) {
          vm.loadFailed = true;
          notifier.error($filter('translate')('COMMON_VISIT_HEADER_ERROR'));
        });
    }

    function updateLastVisitMessage() {
      if (vm.lastVisit) {
        var formatedStartDate = moment(vm.lastVisit.startDatetime).utcOffset('+0200').format(DATETIME_FORMAT);
        var formatedStopDate = moment(vm.lastVisit.stopDatetime).utcOffset('+0200').format(DATETIME_FORMAT);
        vm.lastVisitMessage = vm.lastVisit.visitType.name + ' ' + translateFilter('COMMON_FROM') + ' '
        + formatedStartDate + ' ' + translateFilter('COMMON_TO') + ' '
        + formatedStopDate
    }
    }

    function updateConsultationMessages() {
      if (vm.lastConsultation) {
        vm.lastConsultationMessage = translateFilter('COMMON_LAST') + ': '
          + dateFilter(vm.lastConsultation.encounterDatetime, 'short') + ' '
          + translateFilter('COMMON_BY') + ': ' + vm.lastConsultation.provider.display + ' | '
          + translateFilter('COMMON_NEXT') + ': ';
      }

      if (vm.nextConsultation) {
        vm.nextConsultationMessage = dateFilter(vm.nextConsultation.value, 'short');
      }
    }

    function updatePharmacyMessages() {
      if (vm.lastPharmacy) {
        vm.lastPharmacyMessage = translateFilter('COMMON_LAST') + ': '
          + dateFilter(vm.lastPharmacy.encounterDatetime, 'short') + ' '
          + translateFilter('COMMON_BY') + ': ' + vm.lastPharmacy.provider.display + ' | '
          + translateFilter('COMMON_NEXT') + ': ';
      }

      if (vm.nextPharmacy) {
        vm.nextPharmacyMessage = dateFilter(vm.nextPharmacy.value, 'short');
      }
    }
  }

})();
