(function () {
  'use strict';

  angular
    .module('common.patient')
    .directive('scheduleList', scheduleList);

  scheduleList.$inject = [];

  /* @ngInject */
  function scheduleList() {
    var directive = {
      bindToController: true,
      controller: ScheduleListController,
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        onPatientSelect: '&'
      },
      templateUrl: '../common/patient/directives/scheduleList.html'
    };
    return directive;
  }

  ScheduleListController.$inject = ['$q', 'commonService', 'cohortService', 'observationsService', 'visitService'];

  /* @ngInject */
  function ScheduleListController($q, commonService, cohortService, observationsService, visitService) {

    var vm = this;

    vm.patients = [];

    activate();

    ////////////////

    function activate() {
      cohortService.getMarkedForConsultationToday().then(function (members) {
          vm.patients = members;
        })
        .then(function () {
          return $q.all(vm.patients.map(function (m) {
            return getLastConsultationAndVisit(m);
          }));
        });
    }

    function getLastConsultationAndVisit(member) {
      return observationsService.getObs(member.uuid, Bahmni.Common.Constants.nextConsultationDateUuid).then(function (obs) {
        var nonRetired = commonService.filterRetired(obs);
        member.scheduledInfo = _.maxBy(nonRetired, 'encounter.encounterDatetime');
      })
      .then(function () {
        return visitService.search({
          patient: member.uuid,
          v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'
        });
      })
      .then(function (visits) {
        member.lastVisit = _.maxBy(visits, 'startDatetime');
      });
    }
  }

})();

