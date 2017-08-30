(function () {
  'use strict';

  angular
    .module('common.patient')
    .controller('VisitController', VisitController);

  VisitController.$inject = ['$rootScope', '$stateParams', '$filter', 'visitService', 'encounterService',
    'commonService', 'localStorageService', 'patientService', 'notifier'];

  /* @ngInject */
  function VisitController($rootScope, $stateParams, $filter, visitService, encounterService, commonService,
                           localStorageService, patientService, notifier) {


    var d = $filter('date');
    var t = $filter('translate');

    var dateUtil = Bahmni.Common.Util.DateUtil;
    var isFirstVisit = false;
    var lastVisit = null;
    var patientUuid = $stateParams.patientUuid;

    var vm = this;
    vm.disableCheckin = false;
    vm.lastConsultationMessage = t('COMMON_NONE');
    vm.lastConsultation = null;
    vm.lastPharmacyMessage = t('COMMON_NONE');
    vm.lastPharmacy = null;
    vm.lastUnclosedVisit = null;
    vm.lastVisitMessage = t('COMMON_NONE');
    vm.nextConsultationMessage = t('COMMON_NOT_SCHEDULED');
    vm.nextConsultation = null;
    vm.nextPharmacy = null;
    vm.todayVisit = null;

    vm.checkIn = checkIn;

    activate();

    ////////////////

    function activate() {
      visitService.search({
        patient: patientUuid,
        v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'
      })
        .then(function (visits) {
          lastVisit = _.maxBy(visits, 'startDatetime');
          updateLastVisitMessage();
        });

      patientService.getPatient(patientUuid).then(function (patient) {
        encounterService.getEncountersForEncounterType(patientUuid,
          (patient.age.years >= 15) ? $rootScope.encounterTypes.followUpAdult :
            $rootScope.encounterTypes.followUpChild)
          .success(function (data) {
              var last = _.maxBy(data.results, 'encounterDatetime');
              if (!last) return;
              vm.lastConsultation = last;
              vm.nextConsultation = _.find(last.obs, function (o) {
                return o.concept.uuid === "e1dae630-1d5f-11e0-b929-000c29ad1d07";
              });
              updateConsultationMessages();
            }
          );
      });


      encounterService.getEncountersForEncounterType(patientUuid, $rootScope.encounterTypes.fila)
        .success(function (data) {
            var last = _.maxBy(data.results, 'encounterDatetime');
            if (!last) return;
            vm.lastPharmacy = last;
            vm.nextPharmacy = _.find(last.obs, function (o) {
              return o.concept.uuid === "e1e2efd8-1d5f-11e0-b929-000c29ad1d07";
            });
            updatePharmacyMessages();
          }
        );

      visitService.search({patient: patientUuid, v: "full"}).then(searchVisitByPatientCallback);
    }

    function searchVisitByPatientCallback(visits) {
      var nonRetired = commonService.filterRetired(visits);
      isFirstVisit = _.isEmpty(nonRetired);
      var unclosed = visitService.activeVisits(nonRetired);
      //in case the patient has an active visit
      if (!_.isEmpty(unclosed)) {
        vm.lastUnclosedVisit = _.maxBy(unclosed, 'startDatetime');
        vm.lastUnclosedVisit = fixVisitDatetime(vm.lastUnclosedVisit);
        vm.disableCheckin = true;
      } else {
        var lastVisit = _.maxBy(nonRetired, 'startDatetime');
        lastVisit = fixVisitDatetime(lastVisit);
        var now = dateUtil.now();

        //is last visit todays
        if (lastVisit
          && dateUtil.parseDatetime(lastVisit.startDatetime) <= now
          && dateUtil.parseDatetime(lastVisit.stopDatetime) >= now) {
          vm.todayVisit = lastVisit;
          vm.disableCheckin = true;
        }
      }
    }

    function checkIn() {
      var location = localStorageService.cookie.get("emr.location");
      if (!location) {
        notifier.error(t('COMMON_MESSAGE_ERROR_ACTION'));
        return;
      }

      var visitType = null;
      if (isFirstVisit) {
        visitType = _.find($rootScope.defaultVisitTypes, function (o) {
          return o.occurOn === "first";
        });
      } else {
        visitType = _.find($rootScope.defaultVisitTypes, function (o) {
          return o.occurOn === "following";
        });
      }

      //create visit object
      var visit = {
        patient: patientUuid,
        visitType: visitType.uuid,
        location: location.uuid,
        startDatetime: dateUtil.now(),
        stopDatetime: dateUtil.endOfToday()
      };

      visitService.create(visit)
        .then(successCallback)
        .catch(function () {
          notifier.error(t('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function successCallback(visitProfileData) {
      vm.todayVisit = visitProfileData;
      vm.todayVisit.startDatetime = dateUtil.removeOffset(vm.todayVisit.startDatetime);
      vm.todayVisit.stopDatetime = dateUtil.removeOffset(vm.todayVisit.stopDatetime);
      $rootScope.hasVisitToday = true;
      vm.disableCheckin = true;
    }

    function fixVisitDatetime(visit) {
      if (visit) {
        visit.startDatetime = dateUtil.removeOffset(visit.startDatetime);
        visit.stopDatetime = dateUtil.removeOffset(visit.stopDatetime);
        return visit;
      }
    }

    function updateLastVisitMessage() {
      if (lastVisit) {
        vm.lastVisitMessage = lastVisit.visitType.name + ' ' + t('COMMON_FROM') + ' '
          + d(lastVisit.startDatetime, 'short') + ' ' + t('COMMON_TO') + ' ' + d(lastVisit.stopDatetime, 'short')
      } else {
        vm.lastVisitMessage = t('COMMON_NONE');
      }
    }

    function updateConsultationMessages() {
      if (vm.lastConsultation) {
        vm.lastConsultationMessage = t('COMMON_LAST') + ': ' + d(vm.lastConsultation.encounterDatetime, 'short')
          + ' | ' + t('COMMON_BY') + ': ' + vm.lastConsultation.provider.display + ' | ' + t('COMMON_NEXT') + ': ';
      } else {
        vm.lastConsultationMessage = t('COMMON_NONE');
      }

      if (vm.nextConsultation) {
        vm.nextConsultationMessage = d(vm.nextConsultation.value, 'short');
      } else {
        vm.nextConsultationMessage = t('COMMON_NOT_SCHEDULED');
      }
    }

    function updatePharmacyMessages() {
      if (vm.lastPharmacy) {
        vm.lastPharmacyMessage = t('COMMON_LAST') + ': ' + d(vm.lastPharmacy.encounterDatetime, 'short')
          + ' | ' + t('COMMON_BY') + ': ' + vm.lastPharmacy.provider.display + ' | ' + t('COMMON_NEXT') + ': ';
      } else {
        vm.lastPharmacyMessage = t('COMMON_NONE');
      }

      if (vm.nextPharmacy) {
        vm.nextPharmacyMessage = d(vm.nextPharmacy.value, 'short');
      } else {
        vm.nextPharmacyMessage = t('COMMON_NOT_SCHEDULED');
      }
    }
  }

})();
