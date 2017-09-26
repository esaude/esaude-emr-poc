(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices.serviceform')
    .controller('FormController', FormController);

  FormController.$inject = ['$location', '$q', '$rootScope', '$scope', '$state', '$stateParams',
    'clinicalServicesService', 'createEncounterMapper', 'encounterService', '$filter', 'localStorageService', 'notifier',
    'patientAttributeService', 'spinner', 'visitService', 'updateEncounterMapper'];

  /* @ngInject */
  function FormController($location, $q, $rootScope, $scope, $state, $stateParams, clinicalServicesService,
                          createEncounterMapper, encounterService, $filter, localStorageService, notifier, patientAttributeService,
                          spinner, visitService, updateEncounterMapper) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var serviceEncounter = $stateParams.encounter;
    var patientUUID = $stateParams.patientUuid;
    var serviceId = $stateParams.serviceId;

    $scope.currentFormPart = {};
    $scope.formInfo = {};
    $scope.formLayout = {};
    $scope.hasVisitToday = false;
    $scope.submitted = false;
    $scope.todayVisit = null;
    $scope.visitedFields = [];

    $scope.compactName = compactName;
    $scope.getAutoCompleteList = getAutoCompleteList;
    $scope.getDataResults = getDataResults;
    $scope.linkDashboard = linkDashboard;
    $scope.save = save;
    $scope.stepInFormPart = stepInFormPart;
    $scope.updateCurrentFormPart = updateCurrentFormPart;

    activate();

    ////////////////

    function activate() {
      var currentSref = $state.current.url.replace("/", ".");
      var patient = {uuid: patientUUID};
      var service = {id: serviceId};

      $scope.formInfo = clinicalServicesService.getFormLayouts({id: serviceId});

      $scope.currentFormPart = _.find($scope.formInfo.parts, function (formPart) {
        return formPart.sref === currentSref;
      });

      var getFormData = clinicalServicesService.getFormData(patient, service, serviceEncounter);
      //initialize visit info in scope
      var getTodaysVisit = visitService.getTodaysVisit($scope.patient.uuid);

      var load = $q.all([getFormData, getTodaysVisit]).then(function (results) {
        var formData = results[0];
        var visitToday = results[1];

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

        if (serviceEncounter === clinicalService.lastEncounterForService) {
          openMRSEncounter = addMappedDateObs(clinicalService, openMRSEncounter);
        }

        var editEncounter = updateEncounterMapper.mapFromFormPayload(openMRSEncounter, $scope.formPayload.encounter);

        encounterService.update(editEncounter).success(encounterSuccessCallback)
          .error(encounterErrorCallback);
      }
    }

    function linkDashboard() {
      $location.url('/dashboard/' + $rootScope.patient.uuid);
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
      $location.url(eval($rootScope.landingPageAfterSave));
      notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
    }

    function encounterErrorCallback(encounterProfileData, status) {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }
  }
})();