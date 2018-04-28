(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.serviceform')
    .component('formWizard', {
      bindings: {
        formInfo: '<',
        patient: '<'
      },
      controller: FormWizardController,
      controllerAs: 'vm',
      templateUrl: '../poc-common/clinical-services/service-form/components/formWizard.html'
    });

  FormWizardController.$inject = ['$filter', '$q', '$rootScope', '$scope', '$state', '$stateParams', '$transitions',
    'clinicalServicesService', 'createEncounterMapper', 'encounterService', 'localStorageService', 'notifier',
    'patientAttributeService', 'patientService', 'sessionService',  'updateEncounterMapper', 'visitService'];

  /* @ngInject */
  function FormWizardController($filter, $q, $rootScope, $scope, $state, $stateParams, $transitions,
                                clinicalServicesService, createEncounterMapper, encounterService, localStorageService,
                                notifier, patientAttributeService, patientService, sessionService,
                                updateEncounterMapper, visitService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var serviceEncounter = $stateParams.encounter;
    var patientUUID = $stateParams.patientUuid;
    var serviceId = $stateParams.serviceId;
    var returnState = $stateParams.returnState;

    var vm = this;

    vm.currentFormPart = {};
    vm.formInfo = {};
    vm.formLayout = {};
    vm.hasVisitToday = false;
    vm.submitted = false;
    vm.todayVisit = null;
    vm.visitedFields = [];
    vm.previousEncounter = null;

    vm.$onInit = onInit;
    vm.compactName = compactName;
    vm.getAutoCompleteList = getAutoCompleteList;
    vm.getDataResults = getDataResults;
    vm.linkDashboard = linkDashboard;
    vm.save = save;
    vm.stepInFormPart = stepInFormPart;
    vm.updateCurrentFormPart = updateCurrentFormPart;
    vm.getPreviousEncounter = getPreviousEncounter;

    $transitions.onSuccess({}, function (trasition) {
      if (trasition.to().name.split('.')[0] === $state.current.name.split('.')[0]) {
        setCurrentFormPart();
      }
    });

    ////////////////

    function onInit() {

      var service = { id: serviceId };

      vm.formInfo = clinicalServicesService.getFormLayouts({ id: serviceId });

      setCurrentFormPart();

      var getPatient = patientService.getPatient(patientUUID);

      var getFormData = clinicalServicesService.getFormData({ uuid: patientUUID }, service, serviceEncounter);
      //initialize visit info in scope
      var getTodaysVisit = visitService.getTodaysVisit(patientUUID);

      var deferred = $q.defer();
      vm.previousEncounter = deferred.promise;

      $q.all([getPatient, getFormData, getTodaysVisit]).then(function (results) {
        var patient = results[0];
        var formData = results[1];
        var visitToday = results[2];

        vm.patient = patient;

        var previousEncounter = getPreviousEncounter(formData, serviceEncounter);
        deferred.resolve(previousEncounter);

        vm.formPayload = formData;

        if (visitToday) {
          vm.hasVisitToday = true;
          vm.todayVisit = visitToday;
        } else {
          vm.hasVisitToday = false;
        }
      });
    }

    function setCurrentFormPart() {
      var currentSref = $state.current.url.replace("/", ".");
      vm.currentFormPart = _.find(vm.formInfo.parts, function (formPart) {
        return formPart.sref === currentSref;
      });
    }

    function getPreviousEncounter(formData, serviceEncounter) {

      var previousEncounter = null;

      //se o encounter não vem preenchido então podemos concluir
      //que estamos a adicionar
      if (!formData.service.hasEntryToday) {
        previousEncounter = formData.service.lastEncounterForService;
      } else {
        var serviceEncounters = formData.service.encountersForService;
        for (var i = 0; i < serviceEncounters.length; i++) {
          var currentEncounter = serviceEncounters[i];
          if (currentEncounter.uuid === serviceEncounter.uuid) {
            if (i < serviceEncounters.length - 1) {
              previousEncounter = serviceEncounters[i + 1];
              break;
            }
          }
        }
      }

      return previousEncounter;
    }

    function stepInFormPart(formPart) {
      vm.currentFormPart = formPart;
    }

    function updateCurrentFormPart(nextSref, validity) {
      if (validity) {
        vm.currentFormPart = _.find(vm.formInfo.parts, function (formPart) {
          return formPart.sref === nextSref;
        });
        vm.submitted = false;
        $state.go(vm.formInfo.sufix + nextSref);
      } else {
        vm.submitted = true;
      }
    }

    function getAutoCompleteList(attributeName, query, type) {
      return patientAttributeService.search(attributeName, query, type);
    }

    function getDataResults(data) {
      return data.results;
    }

    function compactName(name) {
      return name.trim().replace(/[^a-zA-Z0-9]/g, '');
    }

    // TODO: move this to clinicalServicesService
    function save() {
      var currDate = Bahmni.Common.Util.DateUtil.now();
      var location = sessionService.getCurrentLocation();

      var openMRSEncounter = createEncounterMapper.mapFromFormPayload(vm.formPayload,
        vm.formInfo.parts,
        vm.patient.uuid,
        location.uuid,
        $rootScope.currentUser.person.uuid,
        currDate);//set date

      var clinicalService = vm.formPayload.service;

      if (!serviceEncounter) {
        //in case the service has a date mark
        openMRSEncounter = addMappedDateObs(clinicalService, openMRSEncounter);

        if (vm.hasVisitToday) {
          encounterService.create(openMRSEncounter)
            .then(encounterSuccessCallback)
            .catch(encounterErrorCallback);
        } else {
          checkIn()
            .then(encounterService.create(openMRSEncounter))
            .then(encounterSuccessCallback)
            .catch(encounterErrorCallback);
        }

      } else {

        if (!clinicalService.hasEntryToday) {
          openMRSEncounter = addMappedDateObs(clinicalService, openMRSEncounter);
        }

        var editEncounter = updateEncounterMapper.mapFromFormPayload(openMRSEncounter, vm.formPayload.encounter);

        encounterService.update(editEncounter).then(encounterSuccessCallback)
          .catch(encounterErrorCallback);
      }
    }

    function linkDashboard() {
      $state.go(returnState, { patientUuid: patientUUID });
    }

    function addMappedDateObs(clinicalService, openMRSEncounter) {
      //in case the service has a date mark
      if (clinicalService.markedOn) {
        var obs = {
          concept: clinicalService.markedOn,
          obsDatetime: dateUtil.now(),
          person: openMRSEncounter.patient,
          value: dateUtil.getDateInDatabaseFormat(dateUtil.now())
        };
        openMRSEncounter.obs.push(obs);
      }
      return openMRSEncounter;
    }

    function checkIn() {
      var visitType = _.find($rootScope.defaultVisitTypes, function (o) {
        return o.occurOn === "following";
      });
      var location = sessionService.getCurrentLocation();
      //create visit object
      var visit = {
        patient: vm.patient.uuid,
        visitType: visitType.uuid,
        location: location.uuid,
        startDatetime: dateUtil.now(),
        stopDatetime: dateUtil.endOfToday()
      };
      return visitService.create(visit);
    }

    function encounterSuccessCallback() {
      $rootScope.hasVisitToday = true;
      $state.go(returnState, { patientUuid: patientUUID });
      notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
    }

    function encounterErrorCallback() {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }

  }

})();
