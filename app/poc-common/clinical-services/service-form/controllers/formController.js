(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.serviceform')
    .controller('FormController', FormController);

  FormController.$inject = ['$filter', '$q', '$rootScope', '$scope', '$state', '$stateParams',
    'clinicalServicesService', 'createEncounterMapper', 'encounterService', 'localStorageService', 'notifier',
    'patientAttributeService', 'patientService', 'spinner', 'updateEncounterMapper', 'visitService'];

  /* @ngInject */
  function FormController($filter, $q, $rootScope, $scope, $state, $stateParams, clinicalServicesService,
    createEncounterMapper, encounterService, localStorageService, notifier,
    patientAttributeService, patientService, spinner, updateEncounterMapper, visitService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var serviceEncounter = $stateParams.encounter;
    var patientUUID = $stateParams.patientUuid;
    var serviceId = $stateParams.serviceId;
    var returnState = $stateParams.returnState;

    $scope.patient = {};
    $scope.currentFormPart = {};
    $scope.formInfo = {};
    $scope.formLayout = {};
    $scope.hasVisitToday = false;
    $scope.submitted = false;
    $scope.todayVisit = null;
    $scope.visitedFields = [];
    $scope.previousEncounter = null;

    $scope.compactName = compactName;
    $scope.getAutoCompleteList = getAutoCompleteList;
    $scope.getDataResults = getDataResults;
    $scope.linkDashboard = linkDashboard;
    $scope.save = save;
    $scope.stepInFormPart = stepInFormPart;
    $scope.updateCurrentFormPart = updateCurrentFormPart;

    var vm = this;
    vm.getPreviousEncounter = getPreviousEncounter;

    activate();

    ////////////////

    function activate() {
      var currentSref = $state.current.url.replace("/", ".");
      var service = { id: serviceId };
      $scope.patient = { uuid: patientUUID };

      $scope.formInfo = clinicalServicesService.getFormLayouts({ id: serviceId });

      $scope.currentFormPart = _.find($scope.formInfo.parts, function (formPart) {
        return formPart.sref === currentSref;
      });

      var getPatient = patientService.getPatient($scope.patient.uuid);

      var getFormData = clinicalServicesService.getFormData($scope.patient, service, serviceEncounter);
      //initialize visit info in scope
      var getTodaysVisit = visitService.getTodaysVisit($scope.patient.uuid);

      var deferred = $q.defer();
      $scope.previousEncounter = deferred.promise;

      var load = $q.all([getPatient, getFormData, getTodaysVisit]).then(function (results) {
        var patient = results[0];
        var formData = results[1];
        var visitToday = results[2];

        $scope.patient = patient;

        var previousEncounter = getPreviousEncounter(formData, serviceEncounter);
        deferred.resolve(previousEncounter);

        $scope.formPayload = formData;

        if (visitToday) {
          $scope.hasVisitToday = true;
          $scope.todayVisit = visitToday;
        } else {
          $scope.hasVisitToday = false;
        }
      });

      spinner.forPromise(load);
    }

    function getPreviousEncounter(formData, serviceEncounter) {

      var previousEncounter = null;

      //se o encounter não vem preenchido então podemos concluir 
      //que estamos a adicionar
      if (!serviceEncounter) {
        previousEncounter = formData.service.lastEncounterForService;
      } else {
        var serviceEncounters = formData.service.encountersForService;
        for (var i = 0; i < serviceEncounters.length; i++) {
          var currentEncounter = serviceEncounters[i];
          if (currentEncounter.uuid == serviceEncounter.uuid) {
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
      $scope.currentFormPart = formPart;
    }

    function updateCurrentFormPart(nextSref, validity) {
      if (validity) {
        $scope.currentFormPart = _.find($scope.formInfo.parts, function (formPart) {
          return formPart.sref === nextSref;
        });
        $scope.submitted = false;
        $state.go($scope.formInfo.sufix + nextSref);
      } else {
        $scope.submitted = true;
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
      var location = localStorageService.cookie.get("emr.location");

      var openMRSEncounter = createEncounterMapper.mapFromFormPayload($scope.formPayload,
        $scope.formInfo.parts,
        $scope.patient.uuid,
        location.uuid,
        $rootScope.currentUser.person.uuid,
        currDate);//set date

      var clinicalService = $scope.formPayload.service;

      if (!serviceEncounter) {
        //in case the service has a date mark
        openMRSEncounter = addMappedDateObs(clinicalService, openMRSEncounter);

        if ($scope.hasVisitToday) {
          encounterService.create(openMRSEncounter).success(encounterSuccessCallback);
        } else {
          checkIn().then(encounterService.create(openMRSEncounter).success(encounterSuccessCallback).error(encounterErrorCallback));
        }

      } else {

        if (serviceEncounter.uuid === clinicalService.lastEncounterForService.uuid) {
          openMRSEncounter = addMappedDateObs(clinicalService, openMRSEncounter);
        }

        var editEncounter = updateEncounterMapper.mapFromFormPayload(openMRSEncounter, $scope.formPayload.encounter);

        encounterService.update(editEncounter).success(encounterSuccessCallback)
          .error(encounterErrorCallback);
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
      var location = localStorageService.cookie.get("emr.location");
      //create visit object
      var visit = {
        patient: $scope.patient.uuid,
        visitType: visitType.uuid,
        location: location.uuid,
        startDatetime: dateUtil.now(),
        stopDatetime: dateUtil.endOfToday()
      };
      return visitService.create(visit);
    }

    function encounterSuccessCallback(encounterProfileData) {
      $rootScope.hasVisitToday = true;
      $state.go(returnState, { patientUuid: patientUUID });
      notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
    }

    function encounterErrorCallback(encounterProfileData, status) {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }
  }
})();
