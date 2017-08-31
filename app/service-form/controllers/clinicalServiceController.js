(function () {
  'use strict';

  angular
    .module('serviceform')
    .controller('ClinicalServiceController', ClinicalServiceController);

  ClinicalServiceController.$inject = ['$rootScope', '$scope', '$location', '$stateParams', 'formRequestMapper'];

  /* @ngInject */
  function ClinicalServiceController($rootScope, $scope, $location, $stateParams, formRequestMapper) {

    var patientUuid = $stateParams.patientUuid;

    $rootScope.formPayload = {};
    $rootScope.postAction = '';
    $rootScope.maskedOn = null;
    $rootScope.formInfo = {};

    $rootScope.linkServiceAdd = linkServiceAdd;
    $rootScope.linkServiceEdit = linkServiceEdit;
    $rootScope.linkServiceDisplay = linkServiceDisplay;

    ////////////////

    function linkServiceAdd(service) {

      findFormInfo(service);
      //in case the patient has a service today in
      if (service.hasEntryToday) {
        //procede like editing
        $rootScope.formPayload = formRequestMapper
          .mapFromOpenMRSFormWithEncounter($scope.serviceForms[service.id], service.lastEncounterForService);
        $rootScope.postAction = "add";//add obs to existing encounter
      } else {
        $rootScope.formPayload = formRequestMapper
          .mapFromOpenMRSForm($scope.serviceForms[service.id]);
        $rootScope.postAction = "create";
      }
      //in case the service has a date mark
      if (service.markedOn) {
        $rootScope.maskedOn = service.markedOn;
      }

      $location.url(service.url + "/" + patientUuid + "/" +
        service.id + $scope.formInfo.parts[0].sref.replace(".", "/"));
    }

    function linkServiceEdit(service, encounter) {
      $rootScope.postAction = "edit";

      findFormInfo(service);

      $rootScope.formPayload = formRequestMapper
        .mapFromOpenMRSFormWithEncounter($scope.serviceForms[service.id], encounter);

      $location.url(service.url + "/" + patientUuid + "/" +
        service.id + $scope.formInfo.parts[0].sref.replace(".", "/"));
    }

    function linkServiceDisplay(service, encounter) {
      $rootScope.postAction = "display";

      findFormInfo(service);

      $rootScope.formPayload = formRequestMapper
        .mapFromOpenMRSFormWithEncounter($scope.serviceForms[service.id], encounter);

      $location.url(service.url + "/" + patientUuid + "/" +
        service.id + "/display");
    }

    function findFormInfo(service) {
      $rootScope.formInfo = _.find($scope.formLayout, function(data) {
        return data.id === service.id;
      });
    }
  }

})();
